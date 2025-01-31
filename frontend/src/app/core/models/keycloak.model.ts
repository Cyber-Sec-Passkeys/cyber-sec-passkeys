export interface Roles {
  roles?: string[];
}

export interface JwtAccessToken extends JwtToken {
  'allowed-origins': string[];
  realm_access: Roles;
  resource_access: { [application: string]: Roles };
  scope: string;
}

interface JwtToken {
  acr: string;
  aud: string;
  auth_time: number;
  azp: string;
  email: string;
  email_verified: boolean;
  exp: number;
  iat: number;
  iss: string;
  jti: string;
  nonce: string;
  preferred_username: string;
  session_state: string;
  sub: string;
  typ: string;
}
