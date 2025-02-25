import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss'
})
export class ForgotPasswordComponent {
  emailForm = new FormControl('', [Validators.required, Validators.email]);

  constructor(private auth: AuthService) { }

  onSubmit() {
    if (this.emailForm.valid) {
      const email = this.emailForm.value;
      if (email) {
        this.auth.resetPassword(email);
        alert("email enviado");
      }
    }
  }
}
