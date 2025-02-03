import { computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import {
  patchState,
  signalStore,
  withComputed,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { EMPTY, filter, from, pipe, switchMap, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { JwtAccessToken } from '../models/keycloak.model';
import { AuthService } from '../services/auth.service';
import { KeycloakService } from '../services/keycloak.service';
import { UserInfo } from './../../../../node_modules/angular-oauth2-oidc/types.d';

interface AuthState {
  authenticated: boolean;
  loading: boolean;
  userInfo: any;
  roles: string[];
  discoveryDocLoaded: boolean;
}

const initialState: AuthState = {
  authenticated: false,
  loading: false,
  userInfo: {} as UserInfo,
  roles: [],
  discoveryDocLoaded: false,
};

export const AuthStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed((state) => ({
    username: computed(() => state.userInfo().username),
    isFinanceStaff: computed(() => state.roles().includes('finance-staff')),
    isLoanApprover: computed(() => state.roles().includes('loan-approver')),
    isLoanProcessor: computed(() => state.roles().includes('loan-processor')),
  })),
  withMethods(
    (
      store,
      authService = inject(AuthService),
      keycloakService = inject(KeycloakService),
      router = inject(Router)
    ) => {
      const _decodeJwtToken = (
        jwtAccessToken: JwtAccessToken | undefined
      ): void => {
        const isAccessTokenExpired = jwtAccessToken?.exp
          ? jwtAccessToken.exp < Date.now() / 1000
          : true;
        if (isAccessTokenExpired) {
          patchState(store, { authenticated: false });
          router.navigate(['/login']);
          return;
        }

        const userInfo = {
          username: jwtAccessToken?.preferred_username,
          email: jwtAccessToken?.email,
        };

        const roles =
          (jwtAccessToken?.resource_access[environment.keycloak.clientId]
            ?.roles as string[]) ?? [];

        patchState(store, {
          loading: false,
          authenticated: true,
          userInfo: userInfo,
          roles: roles,
        });
      };

      return {
        configureAndSignIn: rxMethod<void>(
          pipe(
            tap(() => patchState(store, { loading: true })),
            switchMap(() => {
              authService.configure();
              return from(authService.loadDiscoveryDocument());
            }),
            tap(() => patchState(store, { discoveryDocLoaded: true })),
            filter(
              () =>
                window.location.pathname !== '/login' &&
                window.location.pathname !== '/register'
            ),
            switchMap(() =>
              from(authService.parseTokenFromUrl()).pipe(
                switchMap(() => {
                  const state = authService.state;
                  if (state && state !== 'undefined' && state !== 'null') {
                    const stateUrl = !state.startsWith('/')
                      ? decodeURIComponent(state)
                      : state;

                    router.navigateByUrl(stateUrl);
                  }

                  const jwtAccessToken: JwtAccessToken | undefined =
                    authService.getAccessToken()!;

                  _decodeJwtToken(jwtAccessToken);

                  authService.setupAutomaticRefresh();
                  return EMPTY;
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
        register: rxMethod<void>(
          pipe(
            tap(() => keycloakService.register()),
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
