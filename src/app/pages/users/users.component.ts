import { Component, inject, OnInit } from '@angular/core';
import { IUser } from '../../shared/interfaces/user.interface';
import { DatabaseService } from '../../shared/services/database.service';
import { FormControl } from '@angular/forms';
import { AuthService } from '../../shared/services/auth.service';
import { UserType } from '../../shared/enums/userType.enum';


@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class UsersComponent implements OnInit {

  db = inject(DatabaseService);
  auth = inject(AuthService);
  users?: IUser[];
  filteredUsers?: IUser[];

  ngOnInit(): void {
    this.db.getCollection<IUser>('users').subscribe(users => {

      if (users) {
        this.users = users;
      } else {
        console.log('Não foi possível encontrar os usuários');
      }

      this.filteredUsers = users;
    }
    )
  }

  filterUsers(event: Event): void {
    const input = (event.target as HTMLInputElement).value.toLowerCase();

    if (input.trim() === '') {
      this.filteredUsers = this.users;
    }

    this.filteredUsers = this.users?.filter(user =>
      user.nome?.toLowerCase().includes(input) ||
      user.codigo?.toLowerCase().includes(input) ||
      user.email?.toLowerCase().includes(input) ||
      user.tipoUsuario?.toLowerCase().includes(input)
    );

  }

  userTypeChanges(event: Event, user: IUser) {

    const newType = (event.target as HTMLSelectElement).value as UserType;

    if (user.id) {
      this.db.updateDocument<IUser>('users', user.id, { ...user, tipoUsuario: newType })
    }
  }

  deleteUser(user: IUser) {
    if (user.id) {
      this.db.deleteDocument<IUser>('users', user.id);
    }
  }

}
