import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { MatAccordion } from '@angular/material/expansion';
import { MatSnackBar } from '@angular/material/snack-bar';
import { User } from 'src/app/models/users.model';
import { UserService } from 'src/app/services/users.service';

@Component({
  selector: 'app-admin-user',
  templateUrl: './admin-user.component.html',
  styleUrls: ['./admin-user.component.css']
})
export class AdminUserComponent implements OnInit {

  UserService: any;
  profileForm: FormGroup;

  username: string = "";
  email: string = "";
  profileImage: string = "";
  newPassword: string = "";

  constructor(
    private userService: UserService,private fb: FormBuilder,private snackBar: MatSnackBar
  ) { 
    this.profileForm = this.fb.group({
      username: ['', [Validators.minLength(3), Validators.maxLength(20)]],
      email: ['', [Validators.email]],
      profileImage: [''],
      newPassword: ['', [Validators.minLength(6), Validators.maxLength(40)]]
    });
  }

  ngOnInit(): void {
    this.username = localStorage.getItem("username") || "";
    this.email = localStorage.getItem("email") || "";
    this.profileImage = localStorage.getItem("profileimage") || "";

    this.profileForm.patchValue({
      username: this.username,
      email: this.email,
      profileImage: this.profileImage
    });

    this.loadDataUsers();
  }


  // DESTINATIONS


  panelOpenState = false;

  @ViewChild('myaccordion')
  myPanels!: MatAccordion;

  openAll() {
    this.myPanels.openAll();
  }

  closeAll() {
    this.myPanels.closeAll();
  }
  loadDataUsers(){
    this.userService.getAll().subscribe(data => {
      if ("statusCode" in data) {
        this.users = [];
      } else {
        this.users = data;
      }
    })
  }

  hideInput: string = "display: none;"
  showInput: string = "display: block"
  hide: string = "display: none;"
  show: string = "display: block"


  editEvent(option:boolean) {

    if(option){
      this.hideInput = this.show;
      this.showInput = this.hide;
    }else{
      this.hideInput = this.hide;
      this.showInput = this.show;
    }

  }

    // USERS
    hidePass : boolean = true;
    isDisabled : boolean = true;
    users: User[] = [];
  
    usersForm = new FormGroup(
      {
        firstName: new FormControl("", [Validators.required]),
        lastName: new FormControl("", [Validators.required]),
        username: new FormControl("", [Validators.required, Validators.minLength(5), Validators.maxLength(20)]),
        password: new FormControl("", [Validators.required, Validators.minLength(8)])
  
      }
    );
  
    editFormUser = new FormGroup({
        firstName: new FormControl("", [Validators.required]),
        lastName: new FormControl("", [Validators.required]),
        username: new FormControl("", [Validators.required, Validators.minLength(5), Validators.maxLength(20)]),
  
      }
    );
    updateProfile(): void {
      if (this.profileForm.invalid) {
        return;
      }
  
      this.userService.updateProfile(this.profileForm.value).subscribe(
        response => {
          console.log('Profile updated successfully', response);
          this.snackBar.open('Profile updated successfully!', 'Close', {
            duration: 3000,
            horizontalPosition: 'right',
            verticalPosition: 'top',
            panelClass: ['success-snackbar']
          });
        },
        error => {
          console.error('Error updating profile', error);
          this.snackBar.open('Failed to update profile', 'Close', {
            duration: 3000,
            horizontalPosition: 'right',
            verticalPosition: 'top',
            panelClass: ['error-snackbar']
          });
        }
      );
    }
  
    createUser() {
  
      if(!this.usersForm.valid){
        return;
      }
  
      let firstName = this.usersForm.value.firstName;
      let lastName = this.usersForm.value.lastName;
      let username = this.usersForm.value.username;
      let password = this.usersForm.value.password;
  
  
  
      this.userService.create(firstName, lastName, username, password).subscribe(u => {
        console.log(u)
        window.location.reload();
      })
  
  
  
    }
  
    editUser(id:string) {
  
      let fName = this.editFormUser.value.firstName;
      let lName = this.editFormUser.value.lastName;
      let Username = this.editFormUser.value.username;
  
  
      this.userService.update(id,fName, lName, Username).subscribe(u => {
        window.location.reload();
      })
  
  
      this.hideInput = this.hide;
      this.showInput = this.show;
    }
  
    deleteUser(id: string) {
  
      console.log(id)
  
      this.userService.remove(id).subscribe(d => {
        window.location.reload();
      })
    }
  
  
    checkStyle: string=""
  
    checkValid(){
  
      let username = this.usersForm.value.username;
      let password = this.usersForm.value.password;
  
      if((username.length>=5 && username.length<=20) && password.length>=8){
  
        console.log(true)
        this.isDisabled = false;
        this.checkStyle="background-color: green;"
  
      }else{
        this.checkStyle="background-color: red;"
        this.isDisabled = true;
      }
  
  
    }
  

}
