import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  isLoading = false;
  constructor(public authService: AuthService) { }

  onSignUp(signForm: NgForm) {
    if (signForm.invalid) {
      return;
    }
    this.authService.createUser(signForm.value.name, signForm.value.email, signForm.value.password);
  }
}
