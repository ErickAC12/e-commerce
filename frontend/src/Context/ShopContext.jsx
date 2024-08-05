import React, { createContext, useEffect, useState } from "react";
let products = [
    {
        name: "Striped Flutter Sleeve Overlap Collar Peplum Hem Blouse",
        category: "women",
        new_price: 80,
        old_price: 100,
    },
    {
        name: "Striped Flutter Sleeve Overlap Collar Peplum Hem Blouse",
        category: "women",
        new_price: 80,
        old_price: 100,
    },
    {
        name: "Striped Flutter Sleeve Overlap Collar Peplum Hem Blouse",
        category: "women",
        new_price: 80,
        old_price: 100,
    },
    {
        name: "Striped Flutter Sleeve Overlap Collar Peplum Hem Blouse",
        category: "women",
        new_price: 80,
        old_price: 100,
    },
    {
        name: "Men Green Solid Zippered Full-Zip Slim Fit Bomber Jacket",
        category: "men",
        new_price: 80,
        old_price: 100,
    },
    {
        name: "Men Green Solid Zippered Full-Zip Slim Fit Bomber Jacket",
        category: "men",
        new_price: 80,
        old_price: 100,
    },
    {
        name: "Men Green Solid Zippered Full-Zip Slim Fit Bomber Jacket",
        category: "men",
        new_price: 80,
        old_price: 100,
    },
    {
        name: "Men Green Solid Zippered Full-Zip Slim Fit Bomber Jacket",
        category: "women",
        new_price: 80,
        old_price: 100,
    },
    {
        name: "Boys Orange Colourblocked Hooded Sweatshirt",
        category: "kid",
        new_price: 40,
        old_price: 50,
    },
    {
        name: "Boys Orange Colourblocked Hooded Sweatshirt",
        category: "kid",
        new_price: 40,
        old_price: 50,
    },
    {
        name: "Boys Orange Colourblocked Hooded Sweatshirt",
        category: "kid",
        new_price: 40,
        old_price: 50,
    },
    {
        name: "Boys Orange Colourblocked Hooded Sweatshirt",
        category: "kid",
        new_price: 40,
        old_price: 50,
    },
];

export const ShopContext = createContext(null);

const getDefaultCart = () => {
    let cart = {};
    for (let i = 0; i < 300 + 1; i++) {
        cart[i] = 0;
    }
    return cart;
}

const ShopContextProvider = (props) => {
    const [all_product, setAll_product] = useState([]);
    const [cartItems, setCartItems] = useState(getDefaultCart());

    useEffect(() => {
        if (localStorage.getItem('auth-token')) {
            fetch('https://e-commerce-backend-2ocm.onrender.com/getcart', {
                method: 'POST',
                headers: {
                    Accept: 'application/form-data',
                    'auth-token': `${localStorage.getItem('auth-token')}`,
                    'Content-Type': 'application/json',
                },
                body: '',
            })
                .then((res) => res.json())
                .then((data) => setCartItems(data));
        }
    }, []);

    const addToCart = (itemId) => {
        setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }))
        if (localStorage.getItem('auth-token')) {
            fetch('https://e-commerce-backend-2ocm.onrender.com/addtocart', {
                method: 'POST',
                headers: {
                    Accept: 'application/form-data',
                    'auth-token': `${localStorage.getItem('auth-token')}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 'itemId': itemId }),
            })
                .then((res) => res.json())
                .then((data) => console.log(data));
        }
    }
    const removeFromCart = (itemId) => {
        setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] - 1 }));
        if (localStorage.getItem('auth-token')) {
            fetch('https://e-commerce-backend-2ocm.onrender.com/removefromcart', {
                method: 'POST',
                headers: {
                    Accept: 'application/form-data',
                    'auth-token': `${localStorage.getItem('auth-token')}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 'itemId': itemId }),
            })
                .then((res) => res.json())
                .then((data) => console.log(data));
        }
    }
    const getTotalCartAmount = () => {
        let totalAmount = 0;
        for (const item in cartItems) {
            if (cartItems[item] > 0) {
                let itemInfo = all_product.find((product) => product.id === Number(item));
                totalAmount += itemInfo.new_price * cartItems[item];
            }
        }
        return totalAmount;
    }

    const getTotalCartItems = () => {
        let totalItem = 0;
        for (const item in cartItems) {
            if (cartItems[item] > 0) {
                totalItem += cartItems[item];
            }
        }
        return totalItem;
    }

    const startup = async () => {
        await fetch('https://e-commerce-backend-2ocm.onrender.com/removeallproducts', {
            method: "POST",
        });
        for (let index = 0; index < 12; index++) {
            let responseData;
            let formData = new FormData();
            let image = document.createElement('img');
            image.src = `./products/product_${index + 1}.png`;
            formData.append('product', image);
            await fetch('https://e-commerce-backend-2ocm.onrender.com/upload', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'image/png'
                },
                body: formData
            }).then((res) => res.json()).then((data) => { responseData = data })

            if (responseData.success) {
                products[index].image = responseData.image_url;
                console.log(products[index]);
                await fetch('https://e-commerce-backend-2ocm.onrender.com/addproduct', {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(products[index])
                })
            }
        }
        await fetch('https://e-commerce-backend-2ocm.onrender.com/allproducts')
            .then((res) => res.json())
            .then((data) => setAll_product(data))
    }
    const contextValue = { startup, all_product, cartItems, addToCart, removeFromCart, getTotalCartAmount, getTotalCartItems };
    return (
        <ShopContext.Provider value={contextValue}>
            {props.children}
        </ShopContext.Provider>
    )
}

export default ShopContextProvider;
