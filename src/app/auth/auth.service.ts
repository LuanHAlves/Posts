import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthData } from './auth-data.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private urlApiUser = 'http://localhost:3000/api/user/';

  constructor(private http: HttpClient) { }

  createUser(name: string, email: string, password: string) {
    const authData: AuthData = {
      name: name,
      email: email,
      password: password,
    }
    console.log(authData)
    this.http.post(this.urlApiUser + "signup", authData).subscribe(response => {
      console.log(response);
    })
  }
}
