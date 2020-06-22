import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthData } from './auth-data.model';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private token: string;
  private authStatusListener = new Subject<boolean>();
  private isAuthenticated = false;
  private tokenTimer: any;

  constructor(private http: HttpClient, private router: Router) {}

  getToken() {
    return this.token;
  }

  getIsAuth() {
    return this.isAuthenticated;
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
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
    this.http.post<{token: string, expiresIn: number}>('http://localhost:3000/api/auth/login', authData)
      .subscribe((response) => {
        // Get the jwt token for the logged-in user
        const token = response.token;
        this.token = token;
        if (token) {
          const expiresInDuration = response.expiresIn;
          // User's token is good for an hour
          this.tokenTimer = setTimeout(() => {
            this.logoutUser();
          }, expiresInDuration * 1000);
          this.isAuthenticated = true;
          this.authStatusListener.next(true);
          this.router.navigate(['/']);
        }
      });
  }

  // clear tokens and alert other components about
  // status change
  logoutUser() {
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    this.router.navigate(['/']);
    clearTimeout(this.tokenTimer);
  }
}
