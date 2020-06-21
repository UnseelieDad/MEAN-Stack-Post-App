import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthData } from './auth-data.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private token: string;

  constructor(private http: HttpClient) {}

  getToken() {
    return this.token;
  }
  
  // Send new user data to the backend
  createUser(email: string, password: string) {
    const authData: AuthData = {email, password};
    this.http.post('http://localhost:3000/api/auth/signup', authData)
      .subscribe((response) => {
        console.log(response);
      });
  }

  loginUser(email: string, password: string) {
    const authData: AuthData = {email, password};
    this.http.post<{token: string}>('http://localhost:3000/api/auth/login', authData)
      .subscribe((response) => {
        // Get the jwt token for the logged-in user
        const token = response.token;
        this.token = token;
      });
  }
}
