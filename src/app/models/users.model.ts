export interface User {
    includes: any;
    _id: string;
    firstName: string;
    lastName: string;
    username: string;
    password: string;

}

export interface Users{
    id : number;
    username: string;
    password: string;
    email: string;
    profileImage: string;
    role : string;
}