import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { Observable, of, firstValueFrom } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { IUser } from '../interfaces/user.interface';
import { UserType } from '../enums/userType.enum';
import { DatabaseService } from './database.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private auth: AngularFireAuth, private firestore: AngularFirestore, private router: Router, private db: DatabaseService) { }

  signUp(name: string, email: string, password: string) {

    this.auth.createUserWithEmailAndPassword(email, password)
      .then(async userCredential => {
        const user = userCredential?.user;

        if (user) {
          const userData: IUser = {
            codigo: user.uid.substring(0, 6).toUpperCase(),
            nome: name,
            email: email,
            tipoUsuario: UserType.leitor,
            dataCadastro: new Date().toISOString()
          }

          await this.saveData(user.uid, userData);
          this.router.navigate(['/login']);
        }
      })
      .catch((error) => {
        console.log(error);

      })
  }

  saveData(id: string, user: IUser) {
    return this.firestore.collection('users').doc(id).set(user);
  }

  login(email: string, password: string) {
    this.auth.signInWithEmailAndPassword(email, password).then(userCredential => {
      if (userCredential.user) {
        this.router.navigate(['/home']);
      }
    })
      .catch(error => {
        console.log(error);

      })
  }

  resetPassword(email: string) {
    this.auth.sendPasswordResetEmail(email)
      .then(() => { })
      .catch(error => console.log(error))
  }

  logout() {
    this.auth.signOut()
      .then(() => {
        this.router.navigate(['/login']);
      })
      .catch(error => console.log(error))
  }


  getUserData(): Observable<any> {
    return this.auth.authState.pipe(
      switchMap(user => {
        if (user) {
          return this.firestore.collection('users').doc(user.uid).valueChanges();
        } else {
          return of(null);
        }
      })
    )
  }

  getUserId(): Observable<string | null> {
    return this.auth.authState.pipe(
      map(user => user ? user.uid : null)
    )
  }

  // deleteAccount(user: IUser): void {
  //   if (user.id) {
  //     this.db.deleteDocument('users', user.id)
  //       .then(() => {
  //         console.log('Usuário deletado do banco');
  //         this.auth.
  //       })
  //   }
  // }



}


