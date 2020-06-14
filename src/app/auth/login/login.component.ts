import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';

import { AuthService } from '../auth.service'
import { Subscription } from 'rxjs';

@Component({
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
  isLoading = false;
  authErr = false;
  errMsg = "";
  private authStatusSub: Subscription

  constructor(public authService: AuthService) { }

  ngOnInit() {
    this.authStatusSub = this.authService.getAuthStatusListener().subscribe(authStaus =>{
      this.isLoading = false;
    });
  }

  onLogin(loginForm: NgForm) {
    if (loginForm.invalid) {
      return;
    }
    this.isLoading = true
    this.authService.login(loginForm.value.email, loginForm.value.password);
    this.authService.getAuthStatusListener().subscribe(authStatus =>{
      if(!authStatus) {
        this.errMsg = "Ops! Usuárioou senha inválido."
        this.authErr = true;
      } else {
        this.authErr = false;
      }
    });
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }
}
