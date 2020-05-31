import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';

import { AuthData } from './auth-data.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private urlApiUser = 'http://localhost:3000/api/user/';
  private isAutheticated = false;
  private token: string;
  private tokenTimer: any;
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

  createUser(name: string, email: string, password: string) {
    const authData: AuthData = {
      name: name,
      email: email,
      password: password,
    }
    this.http.post(this.urlApiUser + "signup", authData).subscribe(response => {
      console.log(response);
    })
  }

  login(email: string, password: string) {
    const authData: AuthData = {
      name: name,
      email: email,
      password: password,
    }
    this.http.post<{ token: string, expiresIn: number }>(this.urlApiUser + "login", authData).subscribe(response => {
      const token = response.token;
      this.token = token
      if (token) {
        const expiresInDuration = response.expiresIn;
        this.setAuthTimer(3600);
        this.isAutheticated = true;
        this.authStatusListener.next(true);
        const now = new Date()
        const expiresData = new Date(now.getTime() + expiresInDuration * 1000);
        this.saveAuthData(token, expiresData)
        this.router.navigate(['/'])
      }
    })
  }

  autoAuthUser() {
    const authInfo = this.getAuthData();
    if(!authInfo){
      return;
    }
    const now = new Date();
    const expiresIn = authInfo.expiresData.getTime() - now.getTime();
    if (expiresIn > 0) {
      this.token = authInfo.token
      this.isAutheticated = true;
      this.setAuthTimer(expiresIn / 100)
      this.authStatusListener.next(true)
    }
  }

  logout() {
    this.token = null;
    this.isAutheticated = false;
    this.authStatusListener.next(false);
    clearTimeout(this.tokenTimer)
    this.clearAuthData();
    this.router.navigate(['/']);
  }

  private saveAuthData(token: string, expiresData: Date) {
    localStorage.setItem('token', token);
    localStorage.setItem('expiresData', expiresData.toISOString());
  }

  private clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiresData');
  }
  private getAuthData() {
    const token = localStorage.getItem('token');
    const expiresData = localStorage.getItem('expiresData');

    if (!token || !expiresData) {
      return;
    }
    return {
      token: token,
      expiresData: new Date(expiresData)
    }
  }
  private setAuthTimer(durationInSecond: number) {
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, durationInSecond * 1000);
  }

}
