import { Users } from "./users.model";

export interface Wishlist {
    id: number;
    name : string;
    description : string;
    category : string;
    user : Users;

}

export interface WishlistRequestDTO {
    // Define the properties of your request DTO
    userId: string;
    name: string;
    description: string;
    category: string; // Example: list of items in the wishlist

  }