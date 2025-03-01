import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { User } from "../models/users.model";
import { Observable } from "rxjs";
interface ProfileUpdateDTO {
    username?: string;
    email?: string;
    profileImage?: string;
    newPassword?: string;
  }

@Injectable() export class UserService {

    constructor(private http: HttpClient){}

    create(fName:string,lName:string, Username:string, Password:string){
        return this.http.post<User>(environment.API_URL + "/users",{
            firstName: fName,
            lastName: lName,
            username: Username,
            password: Password
        })
    }

    getAll(){
        return this.http.get<User[]>(environment.API_URL + "/users");
    }

    getByID(id:string){
        return this.http.get<User[]>(environment.API_URL + "/user/?id=" + id);
    }

    remove(id:string){
        return this.http.delete<User>(environment.API_URL + "/user/?id=" + id)
    }

    update(id:string, fName:string,lName:string, Username:string){
        return this.http.put<User>(environment.API_URL + "/user/?id="+ id, {
            firstName: fName,
            lastName: lName,
            username: Username
        })
    }

    loginUser(username: string, password: string) {
        return this.http.post<User>(environment.API_URL + "/user/login", {
            username: username,
            password: password
        });
    }
    updateProfile(profileData: ProfileUpdateDTO): Observable<any> {
        return this.http.put<any>(environment.API_URL+"/api/user", profileData);
      }


    login(email: string, password: string): Observable<string> {
        return this.http.post(environment.API_URL+"/api/auth/login", { email, password }, { responseType: 'text' });
      }


      registerUser(userData: any): Observable<any> {
        return this.http.post(environment.API_URL+"/api/auth/register", userData);
      }

}
