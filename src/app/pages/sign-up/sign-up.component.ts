import { Component } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.scss'
})
export class SignUpComponent {

  signUpForm = new FormGroup(
    {
      name: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required]),
      confirmPassword: new FormControl('', Validators.required)
    },
    [this.matchPasswords()]
  )

  constructor(private auth: AuthService) { }

  matchPasswords(): ValidatorFn {

    return (control: AbstractControl): ValidationErrors | null => {
      const password = control.get('password')?.value;
      const confirmPassword = control.get('confirmPassword')?.value;

      return password && confirmPassword && password !== confirmPassword
        ? { passwordsDontMatch: true }
        : null;
    };
  }

  onSubmit() {
    if (this.signUpForm.valid) {
      const name = this.signUpForm.get('name')?.value;
      const email = this.signUpForm.get('email')?.value;
      const password = this.signUpForm.get('password')?.value;
      if (email && password && name) {
        this.auth.signUp(name, email, password);
      }
    }
  }

}
