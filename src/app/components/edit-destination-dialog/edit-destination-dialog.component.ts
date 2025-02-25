import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-edit-destination-dialog',
  templateUrl: './edit-destination-dialog.component.html',
  styleUrls: ['./edit-destination-dialog.component.css']
})
export class EditDestinationDialogComponent {
  editForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<EditDestinationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,  // Receiving data from the calling component
    private fb: FormBuilder
  ) {
    this.editForm = this.fb.group({
      locationEdit: [data.destination.location],
      budgetEdit: [data.destination.budget],
      notesEdit: [data.destination.notes],
      wishlistIdEdit: [data.destination.wishlist.id],
      visitedEdit: [data.destination.visited]
    });
  }

  onSubmit() {
    // Logic for submitting the form
    console.log(this.editForm.value)
    if (this.editForm.valid) {
      console.log(this.editForm.value)
      this.dialogRef.close(this.editForm.value); // Send the updated data back to the calling component
    }
  }

  onNoClick(): void {
    this.dialogRef.close();  // Close the dialog without saving changes
  }
}
