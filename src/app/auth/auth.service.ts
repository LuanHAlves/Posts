import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';

import { AuthData } from './auth-data.model';

import { environment } from '../../environments/environment'

const BACKEND_URL = environment.apiUrl + '/user/';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private isAutheticated = false;
  private token: string;
  private tokenTimer: any;
  private userId: string;
  private authStatusListener = new Subject<boolean>();

  constructor(private http: HttpClient, private router: Router) { }

  getToken() {
    return this.token;
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  getIsAuthenticated() {
    return this.isAutheticated;
  }
  getUserId() {
    return this.userId
  }

  createUser(name: string, email: string, password: string) {
    const authData: AuthData = {
      name: name,
      email: email,
      password: password,
    }
    this.http.post(BACKEND_URL + "signup", authData).subscribe((result) => {
      this.router.navigate(['/']);
    }, error => {
      this.authStatusListener.next(false);
    });
  }

  login(email: string, password: string) {
    const authData: AuthData = {
      name: name,
      email: email,
      password: password,
    }
    this.http.post<{ token: string, expiresIn: number, userId: string }>(BACKEND_URL+ "login", authData).subscribe(response => {
      const token = response.token;
      this.token = token
      if (token) {
        const expiresInDuration = response.expiresIn;
        this.setAuthTimer(3600);
        this.isAutheticated = true;
        this.userId = response.userId;
        this.authStatusListener.next(true);
        const now = new Date()
        const expiresData = new Date(now.getTime() + expiresInDuration * 1000);
        this.saveAuthData(token, expiresData, this.userId);
        this.router.navigate(['/']);
      }
    }, error =>{
      this.authStatusListener.next(false);
    })
  }

  autoAuthUser() {
    const authInfo = this.getAuthData();
    if (!authInfo) {
      return;
    }
    const now = new Date();
    const expiresIn = authInfo.expiresData.getTime() - now.getTime();
    if (expiresIn > 0) {
      this.token = authInfo.token;
      this.isAutheticated = true;
      this.userId = authInfo.userId;
      this.setAuthTimer(expiresIn / 100)
      this.authStatusListener.next(true)
    }
  }

  logout() {
    this.token = null;
    this.isAutheticated = false;
    this.authStatusListener.next(false);
    this.userId = null;
    clearTimeout(this.tokenTimer)
    this.clearAuthData();
    this.router.navigate(['/login']);
  }

  private saveAuthData(token: string, expiresData: Date, userId: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('expiresData', expiresData.toISOString());
    localStorage.setItem('userId', userId);
  }

  private clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiresData');
    localStorage.removeItem('userId')
  }
  private getAuthData() {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    const expiresData = localStorage.getItem('expiresData');

    if (!token || !expiresData) {
      return;
    }
    return {
      token: token,
      userId: userId,
      expiresData: new Date(expiresData)
    }
  }
  private setAuthTimer(durationInSecond: number) {
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, durationInSecond * 1000);
  }

}
