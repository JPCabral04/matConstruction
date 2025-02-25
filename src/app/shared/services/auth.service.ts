import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { User } from '../interfaces/user.interface';
import { UserType } from '../enums/userType.enum';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private auth: AngularFireAuth, private firestore: AngularFirestore, private router: Router) { }

  signUp(email: string, password: string) {

    this.auth.createUserWithEmailAndPassword(email, password)
      .then(async userCredential => {
        const user = userCredential?.user;

        if (user) {
          const userData: User = {
            email: email,
            type: UserType.leitor
          }

          await this.saveData(user.uid, userData);
          this.router.navigate(['/login']);
        }
      })
      .catch((error) => {
        console.log(error);

      })
  }

  saveData(id: string, user: User) {
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

  // logout() {
  //   this.auth.signOut()
  //     .then(() => {
  //       this.router.navigate(['/']);
  //     })
  //     .catch(error => console.log(error))
  // }

  // getUserData(): Observable<any> {
  //   return this.auth.authState.pipe(
  //     switchMap(user => {
  //       if (user) {
  //         return this.firestore.collection('users').doc(user.uid).valueChanges();
  //       } else {
  //         return of(null);
  //       }
  //     })
  //   )
  // }

}
