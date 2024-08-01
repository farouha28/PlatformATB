import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { RegisterService } from '../register.service';

@Component({
  selector: 'app-register',
  template:  `
 <main>
    <section class="auth-section">
        <h2>Register</h2>
        <p>Create a new account</p>
        <div class="auth-box">
            <form (ngSubmit)="onSubmit(registerForm)" #registerForm="ngForm">
                <div class="form-group">
                    <label for="username">Username:</label>
                    <input type="text" id="username" name="username" ngModel required>
                </div>
                <div class="form-group">
                    <label for="password">Password:</label>
                    <input type="password" id="password" name="password" ngModel required>
                </div>
                <div class="form-group">
                    <label for="confirmpassword">Confirm Password:</label>
                    <input type="password" id="confirmpassword" name="confirmpassword" ngModel required>
                </div>
                <button type="submit" class="btn">Register</button>
                <div *ngIf="message" class="alert alert-danger">{{message}}</div>
            </form>
        </div>
    </section>
</main>



 `,
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  message: string | null = null;

  constructor(private registerService: RegisterService) {}

  onSubmit(form: NgForm) {
    if (form.valid) {
      if (form.value.password !== form.value.confirmpassword) {
        this.message = 'Passwords do not match!';
        return;
      }

      const user = {
        username: form.value.username,
        password: form.value.password,
        confirmpassword: form.value.confirmpassword
      };

      this.registerService.register(user)
        .subscribe(
          (response) => {
            console.log('Registration successful', response);
            this.message = 'User registered successfully!';
          },
          (error) => {
            console.error('Registration error', error);
            this.message = 'An error occurred during registration.';
          }
        );
    }
  }
}
