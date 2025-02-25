import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { Destination } from "../models/destinations.model";
import { Observable } from "rxjs";


export interface DestinationDTO {
    wishlistId: number;
    location: string;
    budget: number;
    notes: string;
    visited: boolean;
  }

@Injectable() export class DestinationService {

    constructor(private http: HttpClient){}

    addDestination(destination: DestinationDTO): Observable<Destination> {
        return this.http.post<Destination>(environment.API_URL + "/api/destinations", destination);
    }

     // Method to fetch destinations by wishlistId
    getDestinationsByWishlistId(wishlistId: number): Observable<Destination[]> {
        return this.http.get<Destination[]>(`${environment.API_URL}/api/destinations/wishlist/${wishlistId}`);
    }

    getByID(id:string){
        return this.http.get<Destination[]>(environment.API_URL + "/destination/?id=" + id);
    }

    remove(id:string){
        return this.http.delete<Destination>(environment.API_URL + "/destination/?id=" + id)
    }

    update(destination: DestinationDTO,id:number){
        return this.http.put<Destination>(`${environment.API_URL}/api/destinations/${id}`, destination
        );
    }


}
