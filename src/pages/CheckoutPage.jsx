import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import AddressModal from '../components/AddressModal';
import { cn } from '../lib/utils';
import { userService } from '../services/userService';
import { orderService } from '../services/orderService';
import { cartService } from '../services/cartService';
import settingsService from '../services/settingsService';
import {
    ChevronLeft, Plus, CreditCard, ArrowRight, X, CheckCircle, Ticket, Tag,
    ShoppingBag, AlertCircle, CheckCircle2, Loader2
} from 'lucide-react';
import clsx from 'clsx';

const CheckoutPage = () => {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const { cartItems, cartTotal, clearCart, checkout } = useCart();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [deliveryFee, setDeliveryFee] = useState(30);
    const [addresses, setAddresses] = useState([]);
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState('COD');
    const [isRedirecting, setIsRedirecting] = useState(false);
    const [couponCode, setCouponCode] = useState('');
    const [couponInfo, setCouponInfo] = useState(null);
    const [isValidatingCoupon, setIsValidatingCoupon] = useState(false);

    // Address Modal State
    const [showAddressModal, setShowAddressModal] = useState(false);

    // Initial Data Fetch
    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/profile');
            return;
        }

        const loadData = async () => {
            try {
                const [addrData, settingsData] = await Promise.all([
                    userService.getAddresses(),
                    settingsService.getSettings()
                ]);

                setAddresses(addrData || []);
                const defaultAddr = addrData?.find(a => a.isDefault) || addrData?.[0];
                if (defaultAddr) setSelectedAddress(defaultAddr._id);

                if (settingsData?.data?.deliveryCharge) {
                    setDeliveryFee(settingsData.data.deliveryCharge);
                }
            } catch (err) {
                console.error("Failed to load checkout data", err);
            }
        };

        loadData();
    }, [isAuthenticated, navigate]);

    // Handle Razorpay Payment
    const handleRazorpayPayment = async (orderId, amount) => {
        try {
            const rzpOrderResponse = await orderService.createRazorpayOrder({
                amount,
                orderId
            });

            if (!rzpOrderResponse.success) {
                throw new Error(rzpOrderResponse.message || "Failed to create payment order");
            }

            const { id: rzpOrderId, key: rzpKey } = rzpOrderResponse.data;

            const options = {
                key: rzpKey,
                amount: Math.round(amount * 100),
                currency: "INR",
                name: "Teas N Trees",
                description: `Order #${orderId}`,
                order_id: rzpOrderId,
                handler: async function (response) {
                    try {
                        setLoading(true);
                        const verificationData = {
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                            orderId: orderId
                        };

                        const verifyRes = await orderService.verifyRazorpayPayment(verificationData);

                        if (verifyRes.success) {
                            navigate(`/order-success/${orderId}`);
                        } else {
                            setError("Payment verification failed. Please contact support.");
                            alert("Payment verification failed. Your order status might be pending.");
                        }
                    } catch (err) {
                        console.error("Verification error", err);
                        setError("An error occurred during payment verification.");
                    } finally {
                        setLoading(false);
                    }
                },
                prefill: {
                    name: "",
                    email: "",
                    contact: ""
                },
                theme: {
                    color: '#10b981'
                },
                modal: {
                    ondismiss: function () {
                        setLoading(false);
                        setError("Payment cancelled by user. You can pay later from your order history.");
                        setTimeout(() => navigate(`/track-order/${orderId}`), 2000);
                    }
                }
            };

            const rzp = new window.Razorpay(options);
            rzp.open();

        } catch (err) {
            console.error("Razorpay Error:", err);
            setError(err.message || "Failed to initialize payment.");
            setLoading(false);
            if (orderId) {
                setTimeout(() => navigate(`/track-order/${orderId}`), 2000);
            }
        }
    };

    // Handle Coupon Validation
    const handleApplyCoupon = async () => {
        if (!couponCode.trim()) return;

        setIsValidatingCoupon(true);
        setError('');

        try {
            const response = await cartService.validateCoupon(
                couponCode.trim().toUpperCase(),
                cartTotal,
                'teasntrees'
            );

            if (response.success) {
                setCouponInfo(response.data);
                setError('');
            } else {
                setError(response.message || 'Invalid coupon code');
                setCouponInfo(null);
            }
        } catch (err) {
            console.error("Coupon error", err);
            setError(err.response?.data?.message || 'Failed to validate coupon');
            setCouponInfo(null);
        } finally {
            setIsValidatingCoupon(false);
        }
    };

    const handleRemoveCoupon = () => {
        setCouponCode('');
        setCouponInfo(null);
    };

    // Handle Place Order
    const handlePlaceOrder = async () => {
        if (!selectedAddress) {
            alert("Please select a delivery address");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const selectedAddrObj = addresses.find(a => a._id === selectedAddress);

            const checkoutData = {
                deliveryAddress: {
                    address: selectedAddrObj.addressLine,
                    location: selectedAddrObj.location || { type: 'Point', coordinates: [0, 0] }
                },
                paymentMethod: paymentMethod,
                deliveryZone: 'Standard',
                deliveryInstructions: '',
                couponCode: couponInfo?.couponCode || null
            };

            const response = await checkout(checkoutData);

            if (response.success) {
                setIsRedirecting(true);
                const orderId = response.data?.orderId || response.data?.data?.orderId || response.data?._id;

                if (paymentMethod === 'Online') {
                    await handleRazorpayPayment(orderId, parseFloat(calculatedGrandTotal));
                } else {
                    navigate(`/order-success/${orderId}`);
                }
            } else {
                const msg = response.message || 'Failed to place order';
                setError(msg);
                alert(`Order Failed: ${msg}`);
                setLoading(false);
            }

        } catch (err) {
            console.error("Order error", err);
            const errorMsg = err.response?.data?.message || err.message || 'Something went wrong while placing order';
            setError(errorMsg);
            setLoading(false);
        }
    };

    if (cartItems.length === 0 && !isRedirecting) {
        return (
            <div className="min-h-screen pt-24 pb-20 flex items-center justify-center p-4 bg-slate-50">
                <div className="text-center">
                    <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-400">
                        <ShoppingBag className="w-10 h-10" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-800 mb-2">Your Cart is Empty</h2>
                    <p className="text-slate-500 mb-8">Add some delicious items to checkout.</p>
                    <button
                        onClick={() => navigate('/menu')}
                        className="px-8 py-3 bg-gradient-to-r from-emerald-600 to-teal-500 text-white rounded-xl font-bold hover:shadow-xl active:scale-95 flex items-center gap-2 transition-all shadow-lg mx-auto"
                    >
                        Browse Menu
                    </button>
                </div>
            </div>
        );
    }

    // Calculate totals locally
    const tax = (cartTotal * 0.05);
    const discount = couponInfo ? couponInfo.discountAmount : 0;
    const calculatedGrandTotal = (cartTotal + tax + deliveryFee - discount).toFixed(2);

    return (
        <div className="min-h-screen pt-24 pb-20 bg-slate-50">
            <div className="container mx-auto px-4 lg:px-8 max-w-6xl">

                <div className="flex items-center gap-4 mb-8">
                    <button onClick={() => navigate(-1)} className="p-2 hover:bg-white rounded-full transition-colors">
                        <ChevronLeft className="w-6 h-6 text-slate-600" />
                    </button>
                    <h1 className="text-2xl font-bold text-slate-800">Checkout</h1>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">

                    {/* Left Column */}
                    <div className="flex-1 space-y-6">

                        {/* Address Section */}
                        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold text-slate-800 flex items-center gap-3">
                                    <span className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center text-sm font-bold shadow-md">1</span>
                                    Delivery Address
                                </h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {addresses.map(addr => (
                                    <div
                                        key={addr._id}
                                        onClick={() => setSelectedAddress(addr._id)}
                                        className={cn(
                                            "cursor-pointer rounded-2xl p-5 border-2 transition-all relative",
                                            selectedAddress === addr._id
                                                ? "border-emerald-600 bg-emerald-50/50"
                                                : "border-slate-100 hover:border-slate-200"
                                        )}
                                    >
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <h3 className="font-bold text-slate-800 mb-1">{addr.label || addr.tag || 'Address'}</h3>
                                                <p className="text-sm text-slate-500 leading-relaxed mb-0">
                                                    {addr.addressLine}
                                                </p>
                                            </div>
                                            {selectedAddress === addr._id && (
                                                <CheckCircle className="w-6 h-6 text-emerald-600 flex-shrink-0" />
                                            )}
                                        </div>
                                    </div>
                                ))}

                                <button
                                    onClick={() => setShowAddressModal(true)}
                                    className="border-2 border-dashed border-slate-200 rounded-2xl p-5 flex flex-col items-center justify-center text-slate-400 hover:border-emerald-500 hover:text-emerald-600 hover:bg-emerald-50/50 transition-all min-h-[120px]"
                                >
                                    <Plus className="w-6 h-6 mb-2" />
                                    <span className="font-bold text-sm">Add New Address</span>
                                </button>
                            </div>
                        </div>

                        {/* Payment Section */}
                        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
                            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-3 mb-6">
                                <span className="w-8 h-8 rounded-full bg-slate-800 text-white flex items-center justify-center text-sm font-bold shadow-md">2</span>
                                Payment Method
                            </h2>

                            <div className="space-y-3">
                                <label className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all ${paymentMethod === 'COD' ? 'border-emerald-600 bg-emerald-50/50' : 'border-slate-100 hover:border-slate-200'}`}>
                                    <input
                                        type="radio"
                                        name="payment"
                                        value="COD"
                                        checked={paymentMethod === 'COD'}
                                        onChange={() => setPaymentMethod('COD')}
                                        className="w-5 h-5 text-emerald-600 focus:ring-emerald-500"
                                    />
                                    <div className="flex-1">
                                        <div className="font-bold text-slate-800">Cash on Delivery</div>
                                        <div className="text-xs text-slate-500">Pay lightly when you receive your order</div>
                                    </div>
                                    <CreditCard className={clsx("w-6 h-6", paymentMethod === 'COD' ? "text-emerald-600" : "text-slate-300")} />
                                </label>

                                <label className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all ${paymentMethod === 'Online' ? 'border-emerald-600 bg-emerald-50/50' : 'border-slate-100 hover:border-slate-200'}`}>
                                    <input
                                        type="radio"
                                        name="payment"
                                        value="Online"
                                        checked={paymentMethod === 'Online'}
                                        onChange={() => setPaymentMethod('Online')}
                                        className="w-5 h-5 text-emerald-600 focus:ring-emerald-500"
                                    />
                                    <div className="flex-1">
                                        <div className="font-bold text-slate-800">Online Payment</div>
                                        <div className="text-xs text-slate-500">UPI, Cards, Netbanking</div>
                                    </div>
                                    <CheckCircle2 className={clsx("w-6 h-6", paymentMethod === 'Online' ? "text-emerald-600" : "text-slate-300")} />
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Order Summary */}
                    <div className="lg:w-96 flex-shrink-0">
                        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 sticky top-24">
                            <h2 className="text-xl font-bold text-slate-800 mb-6">Order Summary</h2>

                            {error && (
                                <div className="mb-4 p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm">
                                    <p className="font-semibold mb-2">Order Failed</p>
                                    <p>{error}</p>
                                    {error.includes('Product not found') && (
                                        <button
                                            onClick={() => {
                                                clearCart();
                                                navigate('/menu');
                                            }}
                                            className="mt-3 w-full py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg text-xs font-semibold transition-colors"
                                        >
                                            Clear Cart & Restart (Fix Stale Items)
                                        </button>
                                    )}
                                </div>
                            )}
                            <div className="space-y-4 mb-6 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
                                <div className="space-y-3">
                                    {cartItems.map((item, idx) => (
                                        <div key={item.key || item._id || idx} className="flex gap-3">
                                            <img src={item.image} alt={item.name} className="w-16 h-16 rounded-xl object-cover bg-slate-100" />
                                            <div className="flex-1">
                                                <div className="text-sm font-bold text-slate-800 line-clamp-1">{item.name}</div>
                                                <div className="text-xs text-slate-500 mb-1">{item.size || 'Regular'}</div>
                                                <div className="flex justify-between items-center">
                                                    <div className="text-xs font-bold text-slate-400">x{item.quantity}</div>
                                                    <div className="text-sm font-bold text-slate-800">₹{item.price * item.quantity}</div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="border-t border-dashed border-slate-200 my-4" />

                            {/* Coupon Section */}
                            <div className="mb-6">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Apply Coupon</label>
                                {!couponInfo ? (
                                    <div className="flex gap-2">
                                        <div className="relative flex-1">
                                            <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                            <input
                                                type="text"
                                                value={couponCode}
                                                onChange={(e) => setCouponCode(e.target.value)}
                                                placeholder="Enter Coupon Code"
                                                className="w-full pl-9 pr-4 py-2.5 rounded-xl border-none text-sm focus:ring-1 focus:ring-slate-200 bg-slate-50"
                                            />
                                        </div>
                                        <button
                                            onClick={handleApplyCoupon}
                                            disabled={isValidatingCoupon || !couponCode.trim()}
                                            className={cn(
                                                "px-4 py-2 rounded-xl font-bold text-xs transition-all bg-emerald-600 text-white hover:bg-emerald-700",
                                                (isValidatingCoupon || !couponCode.trim()) && "opacity-50"
                                            )}
                                        >
                                            {isValidatingCoupon ? <Loader2 className="w-4 h-4 animate-spin" /> : "Apply"}
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-between p-3 rounded-xl border border-dashed border-emerald-500/30 bg-emerald-50/50">
                                        <div className="flex items-center gap-2">
                                            <Ticket className="w-5 h-5 text-emerald-600" />
                                            <div>
                                                <div className="text-xs font-bold text-slate-800">{couponInfo.couponCode}</div>
                                                <div className="text-[10px] text-slate-500">₹{couponInfo.discountAmount} discount applied</div>
                                            </div>
                                        </div>
                                        <button 
                                            onClick={handleRemoveCoupon}
                                            className="p-1.5 hover:bg-white rounded-full transition-colors text-slate-400 hover:text-red-500"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                )}
                            </div>

                            <div className="border-t border-dashed border-slate-200 my-4" />

                            <div className="space-y-2 mb-6">
                                <div className="flex justify-between text-sm text-slate-500">
                                    <span>Item Total</span>
                                    <span>₹{cartTotal}</span>
                                </div>
                                <div className="flex justify-between text-sm text-slate-500">
                                    <span>Delivery Fee</span>
                                    <span>₹{deliveryFee}</span>
                                </div>
                                <div className="flex justify-between text-sm text-slate-500">
                                    <span>Taxes (5%)</span>
                                    <span>₹{tax.toFixed(2)}</span>
                                </div>
                                {couponInfo && (
                                    <div className="flex justify-between text-sm font-bold text-emerald-600">
                                        <span>Coupon Discount</span>
                                        <span>-₹{couponInfo.discountAmount}</span>
                                    </div>
                                )}
                                <div className="flex justify-between text-lg font-bold text-slate-800 pt-2 border-t border-slate-100 mt-2">
                                    <span>Grand Total</span>
                                    <span>₹{calculatedGrandTotal}</span>
                                </div>
                            </div>

                            {error && (
                                <div className="bg-red-50 text-red-600 text-xs p-3 rounded-xl mb-4 flex items-start gap-2">
                                    <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                                    {error}
                                </div>
                            )}

                            <button
                                onClick={handlePlaceOrder}
                                disabled={loading}
                                className="w-full py-4 bg-emerald-600 text-white shadow-emerald-600/30 hover:bg-emerald-700 rounded-xl font-bold shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                            >
                                {loading ? 'Placing Order...' : <>Place Order <ArrowRight className="w-5 h-5" /></>}
                            </button>

                            <p className="text-[10px] text-center text-slate-400 mt-4">
                                By placing an order, you agree to our Terms & Conditions
                            </p>
                        </div>
                    </div>
                </div>

                <AddressModal
                    isOpen={showAddressModal}
                    onClose={() => setShowAddressModal(false)}
                    onSelect={(addr) => {
                        setSelectedAddress(addr._id);
                        setShowAddressModal(false);
                    }}
                    selectedAddressId={selectedAddress}
                />

            </div>
        </div>
    );
};

export default CheckoutPage;
