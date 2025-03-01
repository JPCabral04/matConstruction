import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {


  public perfilImagem?: string;
  public isAdmin?: boolean;

  constructor(private auth: AuthService) { }

  ngOnInit() {

    this.auth.getUserData().subscribe(user => {
      if (user) {
        this.perfilImagem = user.imagemUrl;
        this.isAdmin = user.tipoUsuario === 'administrador';
      }
    })

  }

  logout() {
    this.auth.logout();
  }

}
