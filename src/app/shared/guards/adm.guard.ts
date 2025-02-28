import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Observable, from, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { IUser } from '../interfaces/user.interface';

export const admGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  return from(auth.getUserData()).pipe(
    map((user: IUser) => {

      if (user) {
        return user.tipoUsuario === 'administrador' ? true : router.createUrlTree(['/home']);
      }
      return router.createUrlTree(['/home']);
    })
  );

};
