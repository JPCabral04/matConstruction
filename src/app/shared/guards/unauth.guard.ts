import { inject } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { CanActivateFn, Router } from '@angular/router';
import { map } from 'rxjs';

export const unauthGuard: CanActivateFn = (route, state) => {
  const auth = inject(AngularFireAuth);
  const router = inject(Router);

  return auth.authState.pipe(
    map(user => user ? router.createUrlTree(['/home']) : true)
  );
};
