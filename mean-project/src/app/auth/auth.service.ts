import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthData } from './auth-data.model';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private token: string;
  private authStatusListener = new Subject<boolean>();
  private isAuthenticated = false;
  private tokenTimer: any;
  private userId: string;

  constructor(private http: HttpClient, private router: Router) {}

  getToken() {
    return this.token;
  }

  getIsAuth() {
    return this.isAuthenticated;
  }

  getUserId() {
    return this.userId;
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  // Send new user data to the backend
  createUser(email: string, password: string) {
    const authData: AuthData = { email, password };
    return this.http
      .post('http://localhost:3000/api/auth/signup', authData)
        .subscribe(() => {
          this.router.navigate(['/']);
        }, error => {
          // if creating a user errors, emit false so signup
          // stops loading
          this.authStatusListener.next(false);
        });
  }

  loginUser(email: string, password: string) {
    const authData: AuthData = { email, password };
    this.http
      .post<{ token: string; expiresIn: number; userId: string }>(
        'http://localhost:3000/api/auth/login',
        authData
      )
      .subscribe((response) => {
        // Get the jwt token for the logged-in user
        const token = response.token;
        this.token = token;
        if (token) {
          const expiresInDuration = response.expiresIn;
          // User's token is good for an hour
          this.setAuthTimer(expiresInDuration);
          this.isAuthenticated = true;
          this.userId = response.userId;
          this.authStatusListener.next(true);
          const now = new Date();
          const expirationDate = new Date(
            now.getTime() + expiresInDuration * 1000
          );
          this.saveAuthData(token, expirationDate, this.userId);
          this.router.navigate(['/']);
        }
      }, error => {
        this.authStatusListener.next(false);
      });
  }

  // clear tokens and alert other components about
  // status change
  logoutUser() {
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.userId = null;
    this.router.navigate(['/']);
  }

  // Automatically authenticate user if info is in local storage
  autoAuthUser() {
    const authInformation = this.getAuthData();
    if (!authInformation) {
      return;
    }
    const now = new Date();
    const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
    // If the token is still valid, update permissions
    if (expiresIn > 0) {
      this.token = authInformation.token;
      this.isAuthenticated = true;
      this.userId = authInformation.userId;
      this.setAuthTimer(expiresIn / 1000);
      this.authStatusListener.next(true);
    }
  }

  private setAuthTimer(duration: number) {
    this.tokenTimer = setTimeout(() => {
      this.logoutUser();
    }, duration * 1000); // expire duration in seconds needs to convert to miliseconds
  }

  // Save authentication token and expire date to persist through reloads
  private saveAuthData(token: string, expirationDate: Date, userId: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
    localStorage.setItem('userId', userId);
  }

  // clear token and expiration date from storage
  private clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
    localStorage.removeItem('userId');
  }

  // get token and exp date from local storage if it exists
  private getAuthData() {
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expiration');
    const userId = localStorage.getItem('userId');
    if (!token || !expirationDate) {
      return;
    }
    return {
      token,
      expirationDate: new Date(expirationDate),
      userId,
    };
  }
}
