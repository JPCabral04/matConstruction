import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {

  public isAdmin: boolean = false;

  constructor(private auth: AuthService) { }

  ngOnInit() {
    this.auth.getCurrentUser()
      .then(user => {
        if (user) {
          this.auth.getUserType(user.uid).subscribe(userType => {
            this.isAdmin = userType === "administrador"
          })
        }
      })
      .catch(error => {
        console.log("Erro ao obter o usuário", error);
      })
  }

  logout() {
    this.auth.logout();
  }

}
