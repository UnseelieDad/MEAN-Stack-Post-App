import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  isLoading = false;

  constructor(private authService: AuthService) { }

  onSignup(form: NgForm) {
    if (form.invalid) {
      return;
    }
    // Submit new user to the backend
    this.authService.createUser(form.value.email, form.value.password);

  }

  ngOnInit(): void {
  }

}
