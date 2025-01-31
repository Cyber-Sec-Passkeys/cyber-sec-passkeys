export const environment = {
  production: false,
  businessServiceUrl: 'http://localhost:8081',
  keycloak: {
    url: 'http://localhost:8080',
    realm: 'uas-finance',
    clientId: 'uas-finance-client',
    redirectUrl: window.location.origin + '/loan-approval',
    postLogoutRedirectUri: window.location.origin + '/login',
    showDebugInformation: true,
  },
};
