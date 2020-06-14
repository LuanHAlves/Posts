import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Subscription } from 'rxjs';

@Component({
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit, OnDestroy {
  isLoading = false;
  authErr = false;
  errMsg = "";
  private authStatusSub: Subscription
  constructor(public authService: AuthService) { }

  ngOnInit() {
    this.authStatusSub = this.authService.getAuthStatusListener().subscribe(authStaus => {
      this.isLoading = false;
    });
  }

  onSignUp(signForm: NgForm) {
    if (signForm.invalid) {
      return;
    }
    this.isLoading = true;
    this.authService.createUser(signForm.value.name, signForm.value.email, signForm.value.password);
    this.authService.getAuthStatusListener().subscribe(authStatus =>{
      if(!authStatus) {
        this.errMsg = "Humm! Acho que esse e-mail já esta em uso."
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
