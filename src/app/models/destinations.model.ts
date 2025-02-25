import { Wishlist } from "./wishlist.model";

export interface Destination {
    id:number;
    location: string;
    budget: number;
    notes: string;
    visited: boolean;
    wishlist: Wishlist
}
