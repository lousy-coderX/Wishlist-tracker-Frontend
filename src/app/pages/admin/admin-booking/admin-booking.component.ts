import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatAccordion } from '@angular/material/expansion';
import { Wishlist, WishlistRequestDTO } from 'src/app/models/wishlist.model';
import { WishlistService } from 'src/app/services/wishlist.service';

@Component({
  selector: 'app-admin-booking',
  templateUrl: './admin-booking.component.html',
  styleUrls: ['./admin-booking.component.css']
})
export class AdminBookingComponent implements OnInit {

  createWishlist() {
    const wishlistRequest: WishlistRequestDTO = {
      userId: this.userID,  // Passing userId from the component
      name: this.createWishlistForm.value.name,
      description: this.createWishlistForm.value.description,
      category: this.createWishlistForm.value.category
    };

    this.wishlistService.createWishlist(wishlistRequest).subscribe(
      (wishlist: Wishlist) => {
        console.log('Wishlist created successfully', wishlist);
      },
      (error) => {
        console.error('Error creating wishlist', error);
      }
    );
  }

  createWishlistForm!: FormGroup;  // Declare the form group

  @ViewChild(MatAccordion) accordion: MatAccordion | undefined;

  displayedColumns: string[] = ['userId', 'wishlistName', 'description', 'category', 'actions'];
  wishlists: Wishlist[] = [];

  u?: any;
  userID = "";

  constructor(private wishlistService: WishlistService, private fb: FormBuilder) { }

  ngOnInit(): void {
    let localUser = localStorage.getItem("id");
    
    if (localUser != undefined) {
      this.userID = localUser;
    }

    this.createWishlistForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      category: ['', Validators.required],
    });

    this.loadDataBookings();
  }

  checkUID() {
    if (this.u != undefined) {
      this.userID = this.u._id;  // Fetch the user ID from localStorage
    } else {
      this.userID = "1";  // Default user ID if not logged in
    }
  }

  loadDataBookings() {
    this.wishlistService.getWishlistsByUserId().subscribe({
      next: (all: Wishlist[]) => {
        this.wishlists = all;
      },
      error: (err) => {
        console.error('Error fetching wishlists', err);
      }
    });
  }
  

  deleteWishlist(id: number) {
    this.wishlistService.deleteWishlist(id).subscribe(
      (response) => {
        console.log(response);
        this.loadDataBookings();  // Reload after deletion
      },
      (error) => {
        console.error('Error deleting wishlist:', error);
      }
    );
  }

  openAll() {
    if (this.accordion) {
      this.accordion.openAll();
    }
  }

  closeAll() {
    if (this.accordion) {
      this.accordion.closeAll();
    }
  }
}
