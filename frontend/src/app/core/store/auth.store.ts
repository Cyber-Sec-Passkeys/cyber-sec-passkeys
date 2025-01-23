import { inject } from '@angular/core';
import { Router } from '@angular/router';
import {
  patchState,
  signalStore,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { EMPTY, filter, from, pipe, switchMap, tap } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { UserInfo } from './../../../../node_modules/angular-oauth2-oidc/types.d';

interface AuthState {
  authenticated: boolean;
  loading: boolean;
  userInfo: any;
  rollen: string[];
  discoveryDocLoaded: boolean;
}

const initialState: AuthState = {
  authenticated: false,
  loading: false,
  userInfo: {} as UserInfo,
  rollen: [],
  discoveryDocLoaded: false,
};

export const AuthStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods(
    (store, authService = inject(AuthService), router = inject(Router)) => {
      const _onLoginPage = (): boolean => window.location.pathname === '/login';

      return {
        configureAndSignIn: rxMethod<void>(
          pipe(
            tap(() => patchState(store, { loading: true })),
            switchMap(() => {
              authService.configure();
              return from(authService.loadDiscoveryDocument());
            }),
            tap(() => patchState(store, { discoveryDocLoaded: true })),
            filter(() => !_onLoginPage()),
            switchMap(() =>
              from(authService.parseTokenFromUrl()).pipe(
                switchMap(() => {
                  return from(authService.parseTokenFromUrl()).pipe(
                    switchMap(() => {
                      const state = authService.state;
                      if (state && state !== 'undefined' && state !== 'null') {
                        const stateUrl = !state.startsWith('/')
                          ? decodeURIComponent(state)
                          : state;

                        console.log(state);
                        router.navigateByUrl(stateUrl);
                      }

                      authService.setupAutomaticRefresh();
                      return EMPTY;
                    })
                  );
                })
              )
            )
          )
        ),
        login: rxMethod<void>(
          pipe(
            tap(() => authService.singleSignOn()),
            switchMap(() => EMPTY)
          )
        ),
      };
    }
  ),
  withHooks({
    onInit(store) {
      store.configureAndSignIn();
    },
  })
);
