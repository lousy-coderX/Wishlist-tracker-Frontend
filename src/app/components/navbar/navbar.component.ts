import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { UserService } from 'src/app/services/users.service';
import { User } from 'src/app/models/users.model'
import { E } from '@angular/cdk/keycodes';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  LogInForm!: FormGroup;
  registerForm!: FormGroup;
  errorMessage = '';

  constructor(private fb: FormBuilder, private userService: UserService,private router: Router) {
    this.LogInForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });
    this.registerForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(20)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      profileImage: ['']
    });
  }

  ngOnInit(): void {

    let localUser = localStorage.getItem("user")
    
    if(localUser != undefined){
      this.u = JSON.parse(localUser)
    }

  }

  u?: User = undefined
  showLogin = false
  showRegister = false

  toggleLoginForm(){
    if(this.showLogin == false && this.showRegister == true){
      this.showLogin = true
      this.showRegister = false
    }else{
      if(this.showLogin){
        this.showLogin = false
      }else{
        this.showLogin = true
      }
    }

  }

  loginUser() {
    if (this.LogInForm.invalid) {
      return;
    }

    const { email, password } = this.LogInForm.value;

    this.userService.login(email, password).subscribe({
      next: (token:any) => {
        console.log(JSON.parse(token));
        localStorage.setItem('token', JSON.parse(token).token); // Save token for future requests
        localStorage.setItem('id', JSON.parse(token).userId);
        localStorage.setItem('profileimage', JSON.parse(token).profileimage);
        localStorage.setItem('email', JSON.parse(token).email);
        localStorage.setItem('username', JSON.parse(token).username);
        console.log('Login successful');
        this.router.navigate(['/user']);

      },
      error: () => {
        this.errorMessage = 'Invalid credentials';
      }
    });
  }

  toggleRegisterForm(){

    if(this.showLogin == true && this.showRegister == false){
      this.showLogin = false
      this.showRegister = true
    }else{
      if(this.showRegister){
        this.showRegister = false
      }else{
        this.showRegister = true
      }
    }
  }


  // LogInForm = new FormGroup({

  //   username: new FormControl("", [Validators.required, Validators.minLength(5), Validators.maxLength(20)]),
  //   password: new FormControl("", [Validators.required, Validators.minLength(8)]),
  // })

  // loginUser(user?:string, password?:string){


  //   let Username = this.LogInForm.value.username;
  //   let Password = this.LogInForm.value.password;

  //   this.userService.loginUser(Username, Password);

  //   if (!this.LogInForm.valid) {

  //     if(user!=undefined && password !=undefined){

  //       this.userService.loginUser(user, password).subscribe(u => {

  //         localStorage.setItem("user", JSON.stringify(u))
  //         alert("SUCCESSFULLY REGISTERED! Signed in as @" + u.username)
  //         window.location.reload();
          
  //       });
  //     }
  //     console.log("ERROR BSIH")
  //     return;
  //   }else{
  //     this.userService.loginUser(Username, Password).subscribe(u => {

  //       if(u == null){
  //         alert("LOGIN FAILED! INVALID USER")
  //       }else{
  //         localStorage.setItem("user", JSON.stringify(u))
  //         alert("LOGIN SUCCESSFUL! Signed in as @" + u.username)
  //         window.location.reload();
  //       }
        
  //     });
  //   }


  // }

  // createUser() {
  //   if (this.registerForm.valid) {
  //     this.userService.registerUser(this.registerForm.value).subscribe({
  //       next: (response) => alert('User registered successfully!'),
  //       error: (err) => alert(`Error: ${err.error}`)
  //     });
  //   }
  // }

  createUser() {
    if (this.registerForm.valid) {
      this.userService.registerUser(this.registerForm.value).subscribe({
        next: () => {
          alert('User registered successfully!');
          this.toggleRegisterForm(); // Close register form
          this.toggleLoginForm(); // Open login form
        },
        error: (err) => alert(`Error: ${err.error}`)
      });
    }
  }
  
  logoutUser(){
    localStorage.removeItem("user");
    window.location.reload();
  }

  // RegisterForm = new FormGroup({

  //   firstName: new FormControl("", [Validators.required]),
  //   lastName: new FormControl("", [Validators.required]),
  //   usernameReg: new FormControl("", [Validators.required, Validators.minLength(5), Validators.maxLength(20)]),
  //   passwordReg: new FormControl("", [Validators.required, Validators.minLength(8)]),
  // })
    
  // createUser() {
  
  //   if(!this.RegisterForm.valid){
  //     return;
  //   }

  //   let firstName = this.RegisterForm.value.firstName;
  //   let lastName = this.RegisterForm.value.lastName;
  //   let usernameReg = this.RegisterForm.value.usernameReg;
  //   let passwordReg = this.RegisterForm.value.passwordReg;



  //   // this.userService.create(firstName, lastName, usernameReg, passwordReg).subscribe(u => {
  //   //   console.log(usernameReg, passwordReg)
  //   //   this.loginUser(usernameReg, passwordReg);

  //   // })


  // }



}
