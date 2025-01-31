import { inject } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import {
  ActivatedRouteSnapshot,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { filter, map, take } from 'rxjs/operators';
import { AuthStore } from '../store/auth.store';

export const authGuard = (
  _: ActivatedRouteSnapshot,
  __: RouterStateSnapshot
): Observable<boolean | UrlTree> => {
  const authStore = inject(AuthStore);
  const router = inject(Router);

  return toObservable(authStore.loading).pipe(
    filter((loading) => !loading),
    take(1),
    map(() => {
      if (!authStore.authenticated()) {
        return router.createUrlTree(['/login']);
      }

      if (!authStore.rollen().includes('finance-staff')) {
        return router.createUrlTree(['/403']);
      }

      return true;
    })
  );
};
