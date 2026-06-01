import React, { createContext, useState, useContext, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState(() => {
        const localData = localStorage.getItem('cart');
        return localData ? JSON.parse(localData) : [];
    });

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cartItems));
    }, [cartItems]);

    const addToCart = (product) => {
        setCartItems(prevItems => {
            const isExist = prevItems.find(item => item.id === product.id);
            if (isExist) {
                return prevItems.map(item =>
                    item.id === product.id ? { ...item, cartQuantity: item.cartQuantity + 1 } : item
                );
            }
            return [...prevItems, { ...product, cartQuantity: 1 }];
        });
    };

    const removeFromCart = (id) => {
        setCartItems(prevItems => prevItems.filter(item => item.id !== id));
    };

    const updateQuantity = (id, amount) => {
        setCartItems(prevItems =>
            prevItems.map(item =>
                item.id === id ? { ...item, cartQuantity: Math.max(1, item.cartQuantity + amount) } : item
            )
        );
    };

    const clearCart = () => {
        setCartItems([]);
    };

    const cartCount = cartItems.reduce((total, item) => total + item.cartQuantity, 0);

    return (
        <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, clearCart, cartCount }}>
            {children}
        </CartContext.Provider>
    );
};
