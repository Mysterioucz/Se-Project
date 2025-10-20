'use client'
import Navbar from '@/src/components/Navbar';
import React, { useState, useMemo } from 'react';
import ShoppingCart from '@mui/icons-material/ShoppingCart';
import { Cart } from '@/src/enums/Cart';
import SummaryBox from './SummaryBox';
import CartItem from './CartItem';
import { CartType } from '../../../../../enums/CartType';
import ModalDeleteFromCart from './ModalDeleteFromCart';
import deleteFromCart from '@/src/lib/deleteFromCart';

export default function CartClient({ initialCartData, AccountID }: { initialCartData: CartType[], AccountID: string }) {

    const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);
    const [idToDelete, setIdToDelete] = React.useState<number>(-1);

    const [cartItems, setCartItems] = useState<CartType[]>(initialCartData);
    const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());

    const handleSelectItem = (id:number) => {
        if (selectedIds.size >= 1 && ! selectedIds.has(id)) {
            alert("Please select no more than one flight to check out");
            return;
        }

        const newSelectedIds = new Set(selectedIds);

        if (newSelectedIds.has(id)) {
            newSelectedIds.delete(id); // unselect if clicked again
        } else {
            newSelectedIds.add(id); // select if none selected yet
        }

        setSelectedIds(newSelectedIds);
    };    

    const handleRemoveClick = (CartID: number) => {
        setIsDeleteModalOpen(true);
        setIdToDelete(CartID);
    };

    const totalPrice = useMemo(() => {
        return cartItems?.reduce((total:number, item:CartType) => {
            if (selectedIds.has(item.id)) {
            return total + item.Price;
            }
            return total;
        }, 0);
    }, [cartItems, selectedIds]);

    const handleDeleteFromCart = (CartID: number, UserAccountID:string) => {
        setCartItems((prevItems) =>
            prevItems.filter((item: CartType) => item.id !== CartID)
        );

        const newSelectedIds = new Set(selectedIds);
        newSelectedIds.delete(CartID);
        setSelectedIds(newSelectedIds);
        deleteFromCart(CartID, UserAccountID);
    }

    return (
    <main>
        { /* Navigation Bar */ }
        <Navbar/>

        {/* Modal Pop-Up */}
        <ModalDeleteFromCart 
        isOpen={isDeleteModalOpen} 
        onClose={() => setIsDeleteModalOpen(false)} 
        handleDeleteFromCart={handleDeleteFromCart} 
        UserAccountID={AccountID}
        CartID={idToDelete}
        />
        
        {/* Cart */}
        <div className="container mx-auto p-4 sm:p-6 md:p-8">
            
            <div className="flex items-center mb-8">
                <ShoppingCart className="w-8 h-8 text-primary-600" />
                <div className="text-3xl font-bold ml-3 text-primary-600">{Cart.YOUR_CART}</div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 lg:gap-8">
                {/* Left Column: Cart Items */}
                <div className="lg:col-span-3 bg-primary-50 rounded-lg p-3">

                {cartItems.length > 0 ? (
                    cartItems.map((item: CartType) => (
                        <CartItem
                            key={item.id}
                            item={item}
                            isSelected={selectedIds.has(item.id)}
                            onSelect={handleSelectItem}
                            onRemove={handleRemoveClick}
                        />
                    ))
                ) : (
                    <div className="text-center text-2xl font-bold rounded-lg bg-primary-50 text-primary-600 my-10">
                        {Cart.EMPTY}
                    </div>
                )}

                {cartItems.length > 0 && (
                    <div className="text-center text-primary-600 mt-4">{Cart.END_OF_CART}</div>
                )}

                </div>

                {/* Summary */}
                <div className="lg:col-span-1 mt-8 lg:mt-0">
                    <SummaryBox selectedCount={selectedIds.size} totalPrice={totalPrice} selectedIds={selectedIds} />
                </div>

            </div>

        </div>
    </main>
    );
}
