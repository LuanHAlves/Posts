import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';

import { AuthData } from './auth-data.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private urlApiUser = 'http://localhost:3000/api/user/';
  private isAutheticated = false;
  private token: string
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
    this.http.post<{ token: string }>(this.urlApiUser + "login", authData).subscribe(response => {
      const token = response.token;
      this.token = token
      if (token) {
        this.isAutheticated = true;
        this.authStatusListener.next(true);
        this.router.navigate(['/'])
      }
    })
  }

  logout() {
    this.token = null;
    this.isAutheticated = false;
    this.authStatusListener.next(false);
    this.router.navigate(['/'])
  }
}
