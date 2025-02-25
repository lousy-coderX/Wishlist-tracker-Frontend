import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Wishlist, WishlistRequestDTO } from '../models/wishlist.model';

@Injectable({
  providedIn: 'root'
})
export class WishlistService {

  private apiUrl = `${environment.API_URL}/api/wishlists`; // Define base URL for your API

  constructor(private http: HttpClient) { }

  // Function to get wishlists by userId
  getWishlistsByUserId(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/user`);
  }

  deleteWishlist(id: number): Observable<string> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete<string>(url);
  }

  createWishlist(wishlistRequest: WishlistRequestDTO): Observable<Wishlist> {
    return this.http.post<Wishlist>(this.apiUrl, wishlistRequest);
  }


}
