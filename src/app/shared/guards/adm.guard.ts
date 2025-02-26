import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Observable, from, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

export const admGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  return from(auth.getCurrentUser()).pipe(
    switchMap(user => {
      if (user) {
        return auth.getUserType(user.uid).pipe(
          map(userType => {
            return userType === 'administrador' ? true : router.createUrlTree(['/home']);
          })
        );
      } else {
        return of(router.createUrlTree(['/home']));
      }
    })
  );
};
