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
import { EMPTY, from, pipe, switchMap, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { JwtAccessToken } from '../models/keycloak.model';
import { AuthService } from '../services/auth.service';
import { KeycloakService } from '../services/keycloak.service';
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
  withComputed((state) => ({
    isFinanceStaff: computed(() => state.rollen().includes('finance-staff')),
    isLoanApprover: computed(() => state.rollen().includes('loan-approver')),
    isLoanProcessor: computed(() => state.rollen().includes('loan-processor')),
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
          //router.navigate(['/login']);
          return;
        }

        patchState(store, {
          loading: false,
          authenticated: true,
          rollen:
            (jwtAccessToken?.resource_access[environment.keycloak.clientId]
              ?.roles as string[]) ?? [],
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
