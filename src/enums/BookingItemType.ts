import { CartType } from "./CartType";

export type BookingItemProps = {
    item: CartType;
    isViewOnly?: boolean
    isSelected?: boolean; 
    onSelect?: (id: number) => void; 
    onRemove?: (id: number) => void; 
};