import { Component, inject, OnInit } from '@angular/core';
import { IUser } from '../../shared/interfaces/user.interface';
import { DatabaseService } from '../../shared/services/database.service';


@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class UsersComponent implements OnInit {

  db = inject(DatabaseService);
  users?: IUser[];

  ngOnInit(): void {
    this.db.getCollection<IUser>('users').subscribe(users => {

      if (users) {
        this.users = users;
        console.log(this.users);
      } else {
        console.log('Não foi possível encontrar os usuários');
      }
    }

    )
  }



}
