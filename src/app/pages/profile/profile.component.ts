import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../shared/services/auth.service';
import { IUser } from '../../shared/interfaces/user.interface';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {

  formWasEditted: boolean = false;

  profileForm = new FormGroup({
    name: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    userType: new FormControl({ value: '', disabled: true }, [Validators.required]),
    userCode: new FormControl({ value: '', disabled: true }, [Validators.required]),
  });

  constructor(private auth: AuthService) { }

  ngOnInit(): void {
    this.auth.getUserData().subscribe(user => {
      this.profileForm.patchValue({
        name: user.nome,
        email: user.email,
        userType: user.tipoUsuario,
        userCode: user.codigoUsuario
      });

      this.formWasEditted = false;
    });

    // Monitorar mudanças no formulário
    this.profileForm.valueChanges.subscribe(() => {
      this.formWasEditted = true;
    });
  }

}
