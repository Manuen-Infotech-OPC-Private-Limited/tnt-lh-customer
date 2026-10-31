import React, { createContext, useContext } from 'react';

const BrandContext = createContext();

export const useBrand = () => useContext(BrandContext);

export const BrandProvider = ({ children }) => {
    const brand = 'teasntrees';

    const setBrand = () => {};

    // Derived theme variables for Teas N Trees
    const theme = {
        isLittleH: false,
        isTeasNTrees: true,
        primaryColorClass: 'bg-cafe-emerald',
        primaryHoverClass: 'hover:bg-emerald-700',
        textColorClass: 'text-cafe-emerald',
        bgLightClass: 'bg-emerald-50',
        gradientClass: 'from-cafe-emerald to-cafe-teal',
        gradientHoverClass: 'hover:shadow-cafe-emerald/40',
        shadowClass: 'shadow-cafe-emerald/30',
        brandName: 'Teas N Trees',
    };

    return (
        <BrandContext.Provider value={{ brand, setBrand, theme, isLittleHActive: false }}>
            {children}
        </BrandContext.Provider>
    );
};
