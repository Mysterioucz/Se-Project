'use client';
import Navbar from '@/src/components/Navbar';
import React, { useState, useMemo } from 'react';
import ShoppingCart from '@mui/icons-material/ShoppingCart';
import DeleteOutline from '@mui/icons-material/DeleteOutline';
import { Cart } from '@/src/enums/Cart';
import SummaryBox from './_components/SummaryBox';
import getCart from '@/src/lib/getCart';
import CartItem from './_components/CartItem';

// --- MOCK DATA ---
const mockCartData = [
  {
    id: '1',
    type: 'one-way',
    fromAirport: 'BKK',
    toAirport: 'ZRH',
    departLeg: {
      airline: 'Airline',
      date: 'Thu, Oct 14',
      departure: { time: '14:50', airportCode: 'BKK', city: 'Bangkok' },
      arrival: { time: '11:50', airportCode: 'ZRH', city: 'Zurich' },
      duration: '21h',
      layover: '8h 35m in Frankfurt',
    },
    passengers: '2 Adults, 2 Children, 2 Infants',
    cabinClass: 'Economy Class',
    price: 50000,
  },
  {
    id: '2',
    type: 'round-trip',
    fromAirport: 'BKK',
    toAirport: 'ZRH',
    departLeg: {
      airline: 'Airline',
      date: 'Thu, Oct 14',
      departure: { time: '14:50', airportCode: 'BKK', city: 'Bangkok' },
      arrival: { time: '11:50', airportCode: 'ZRH', city: 'Zurich' },
      duration: '21h',
      layover: '8h 35m in Frankfurt',
    },
    returnLeg: {
      airline: 'Airline',
      date: 'Thu, Oct 21',
      departure: { time: '14:50', airportCode: 'ZRH', city: 'Zurich' },
      arrival: { time: '11:50', airportCode: 'BKK', city: 'Bangkok' },
      duration: '21h',
      layover: null,
    },
    passengers: '2 Adults, 2 Children, 2 Infants',
    cabinClass: 'Economy Class',
    price: 100000,
  },
];

export default async function CartPage() {
    // const carData = await getCart("8c92f19a-70c6-4857-a22b-611d7e201f84");

    const [cartItems, setCartItems] = useState(mockCartData);
    const [selectedIds, setSelectedIds] = useState(new Set());

    const handleSelectItem = (id:string) => {
        const newSelectedIds = new Set(selectedIds);
        if (newSelectedIds.has(id)) {
            newSelectedIds.delete(id);
        } else {
            newSelectedIds.add(id);
        }
        setSelectedIds(newSelectedIds);
    };

    const handleRemoveItem = (id:string) => {
        setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
        const newSelectedIds = new Set(selectedIds);
        newSelectedIds.delete(id);
        setSelectedIds(newSelectedIds);
    };

    const totalPrice = useMemo(() => {
        return cartItems.reduce((total, item) => {
            if (selectedIds.has(item.id)) {
            return total + item.price;
            }
            return total;
        }, 0);
    }, [cartItems, selectedIds]);

    return (
    <main>
        { /* Navigation Bar */ }
        <Navbar/>
        
        {/* Cart */}
        <div className="container mx-auto p-4 sm:p-6 md:p-8">
            
            <div className="flex items-center mb-8">
                <ShoppingCart className="w-8 h-8 text-primary-600" />
                <h1 className="text-3xl font-bold ml-3 text-primary-600">{Cart.YOUR_CART}</h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 lg:gap-8">
                {/* Left Column: Cart Items */}
                <div className="lg:col-span-3 bg-primary-50 rounded-lg p-3">

                {cartItems.length > 0 ? (
                    cartItems.map((item) => (
                    <CartItem
                        // key={item.id}
                        // item={item}
                        // isSelected={selectedIds.has(item.id)}
                        // onSelect={handleSelectItem}
                        // onRemove={handleRemoveItem}
                    />
                    ))
                ) : (
                    <div className="text-center text-2xl font-bold rounded-lg bg-primary-50 text-primary-600 py-2">
                        {Cart.EMPTY}
                    </div>
                )}

                {cartItems.length > 0 && (
                    <p className="text-center text-primary-600 mt-4">{Cart.END_OF_CART}</p>
                )}

                </div>

                {/* Summary */}
                <div className="lg:col-span-1 mt-8 lg:mt-0">
                    <SummaryBox selectedCount={selectedIds.size} totalPrice={totalPrice} />
                </div>

            </div>

        </div>
    </main>
    );
}
