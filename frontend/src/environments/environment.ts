export const environment = {
  production: false,
  businessServiceUrl: 'http://localhost:8081',
  keycloak: {
    clientId: 'test-client',
    url: 'http://localhost:8080/realms/master',
    redirectUrl: window.location.origin + '/todo',
    postLogoutRedirectUri: window.location.origin + '/login',
    showDebugInformation: true,
  },
};
