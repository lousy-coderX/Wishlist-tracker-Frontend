import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatAccordion } from '@angular/material/expansion';
import { DestinationService } from 'src/app/services/destinations.service';
import { WishlistService } from 'src/app/services/wishlist.service';
import { DestinationDTO } from 'src/app/services/destinations.service';
import { Destination } from 'src/app/models/destinations.model';
import { MatTabGroup } from '@angular/material/tabs/tab-group';
import { EditDestinationDialogComponent } from 'src/app/components/edit-destination-dialog/edit-destination-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { Wishlist } from 'src/app/models/wishlist.model';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-admin-dest',
  templateUrl: './admin-dest.component.html',
  styleUrls: ['./admin-dest.component.css']
})
export class AdminDestComponent implements OnInit {
// This function handles the "EDIT" button click.
editDestination(destination: any) {
  // Set the values of the edit form based on the destination
  this.editForm.patchValue({
    locationEdit: destination.location,
    budgetEdit: destination.budget,
    notesEdit: destination.notes,
    wishlistIdEdit: destination.wishlist.id,
    visitedEdit: destination.visited
  });

  // Change the active tab to the "EDIT" tab
  const tabGroup = document.querySelector('mat-tab-group');
  (tabGroup as unknown as MatTabGroup).selectedIndex = 1;  // Tab index 1 corresponds to the "EDIT" tab
}

editEvent(arg0: boolean) {
throw new Error('Method not implemented.');
}

  displayedColumns: string[] = ['location', 'budget', 'notes', 'visited', 'wishlist', 'actions'];
  userId: number = 1;
  wishlistId: number = 2;
  wishlists: Wishlist[] = [];
  destinations: Destination[] = [];
  activeTab: string = 'destinations';
  step: number = 0;
  panelOpenState = false;

  // Form Group Initialization
  destinationForm: FormGroup;
  editForm: FormGroup;

  @ViewChild('myaccordion') myPanels!: MatAccordion;

  constructor(
    private destService: DestinationService,
    private wishlistService: WishlistService,
    public dialog: MatDialog
  ) {
    this.destinationForm = new FormGroup({
      wishlistId: new FormControl('', Validators.required),
      location: new FormControl('', Validators.required),
      budget: new FormControl(null, [Validators.min(0)]),
      notes: new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(500)]),
      visited: new FormControl(false)
    });

    this.editForm = new FormGroup({
      wishlistIdEdit: new FormControl('', Validators.required),
      locationEdit: new FormControl('', Validators.required),
      budgetEdit: new FormControl(null, [Validators.min(0)]),
      notesEdit: new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(500)]),
      visitedEdit: new FormControl(false)
    });
  }

  ngOnInit(): void {

    let localUser = localStorage.getItem("id");
    
    if (localUser != undefined) {
      this.userId = Number(localUser);
    }

    this.loadData();
  }

  // Open the edit dialog
  editDestination1(destination: any): void {
    const dialogRef = this.dialog.open(EditDestinationDialogComponent, {
      width: '400px',  // Dialog size
      data: { destination, wishlists: this.wishlists } // Pass data to dialog
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log(result)
        this.editDest(destination.id,result);
      }
    });
  }

  // Load Data
  // loadData(): void {
  //   this.wishlistService.getWishlistsByUserId().subscribe(data => {
  //     this.wishlists = data;
  //     this.loadDestinations();
  //   });
  // }
  loadData(): void {
    this.wishlistService.getWishlistsByUserId().subscribe(wishlists => {
      this.wishlists = wishlists;
  
      // Create an array of destination fetch requests
      const destinationRequests = this.wishlists.map(wishlist => 
        this.destService.getDestinationsByWishlistId(wishlist.id)
      );
  
      // Execute all requests in parallel
      forkJoin(destinationRequests).subscribe(destinationsArray => {
        // Flatten the array of destination lists into a single array
        this.destinations = destinationsArray.flat();
      });
    });
  }

  // Load Destinations based on selected wishlist
  loadDestinations(): void {
    this.destService.getDestinationsByWishlistId(this.wishlistId).subscribe(data => {
      this.destinations = data;
    });
  }

  // Toggle Tab
  openPanel(panel: string): void {
    this.activeTab = panel;
  }

  // Navigation between steps
  setStep(index: number): void {
    this.step = index;
  }

  nextStep(): void {
    this.step++;
  }

  prevStep(): void {
    this.step--;
  }

  // Create Destination
  createDest(): void {
    if (this.destinationForm.valid) {
      const destination: DestinationDTO = this.destinationForm.value;
      this.destService.addDestination(destination).subscribe(response => {
        this.destinations.push(response); // Dynamically add the new destination to the list
        this.destinationForm.reset(); // Reset form after successful submission
      }, error => {
        console.error('Error adding destination:', error);
      });
    }
  }


  // Edit Destination
  editDest(id : number ,destination: any): void {
    // Create the updated destination DTO from the form values
    console.log(destination)
    const updatedDestination: DestinationDTO = {
      location: destination.locationEdit,
      wishlistId: destination.wishlistIdEdit,
      notes: destination.notesEdit,
      budget: destination.budgetEdit,
      visited: destination.visitedEdit
    };
  
    console.log('Updated Destination DTO:', updatedDestination);
  
    // Call the service to update the destination
    this.destService.update(updatedDestination, id).subscribe(
      (response) => {
        // Find the destination in the list and update it
        const index = this.destinations.findIndex(dest => dest.id === destination.id);
        if (index !== -1) {
          this.destinations[index] = response; // Replace the updated destination
        }
  
        // Optionally, show success message or UI feedback
        console.log('Destination updated successfully:', response);

        this.loadData();
  
        // Reset the form after successful update
        this.editForm.reset();
      },
      (error) => {
        // Handle error properly
        console.error('Error updating destination:', error);
        // You can also show an error message to the user if needed
      }
    );
  }
  

  // Delete Destination
  deleteDest(id: number): void {
    this.destService.remove(id.toString()).subscribe(() => {
      this.destinations = this.destinations.filter(dest => dest.id !== id); // Remove the deleted destination
    }, error => {
      console.error('Error deleting destination:', error);
    });
  }

  // UI control methods
  openAll(): void {
    this.myPanels.openAll();
  }

  closeAll(): void {
    this.myPanels.closeAll();
  }

  // Edit Panel Visibility Control
  hideInput: boolean = false;

  toggleEditForm(): void {
    this.hideInput = !this.hideInput;
  }
}
