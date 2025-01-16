package de.frankfurtuas.cybersec.config;

import java.util.Collection;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.stream.Stream;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.convert.converter.Converter;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtClaimNames;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.security.oauth2.server.resource.authentication.JwtGrantedAuthoritiesConverter;
import org.springframework.stereotype.Component;

/**
 * A custom JWT authentication converter.
 * <p>
 * This component converts a JWT into an {@link AbstractAuthenticationToken} that Spring Security
 * can use for authorization. It extracts roles and other claims from the JWT.
 */
@Component
public class JwtAuthConverter implements Converter<Jwt, AbstractAuthenticationToken> {

  // Default converter for JWT authorities
  private final JwtGrantedAuthoritiesConverter jwtGrantedAuthoritiesConverter =
      new JwtGrantedAuthoritiesConverter();

  // Attribute in the JWT to use as the principal's name
  @Value("${jwt.auth.converter.principle-attribute}")
  private String principleAttribute;

  // The resource ID to extract roles for this application
  @Value("${jwt.auth.converter.resource-id}")
  private String resourceId;

  /**
   * Converts a JWT into an {@link AbstractAuthenticationToken}.
   *
   * @param jwt The JWT to convert.
   * @return An {@link AbstractAuthenticationToken} containing the JWT and authorities.
   */
  @Override
  public AbstractAuthenticationToken convert(@NonNull Jwt jwt) {

    // Combine default authorities with custom resource roles
    Collection<GrantedAuthority> authorities =
        Stream.concat(
                jwtGrantedAuthoritiesConverter.convert(jwt).stream(), // Default authorities
                extractResourceRoles(jwt).stream()) // Custom resource roles
            .collect(Collectors.toSet()); // Collect authorities into a unique set

    // Create a JwtAuthenticationToken with authorities and principal
    return new JwtAuthenticationToken(jwt, authorities, getPrincipleClaimName(jwt));
  }

  /**
   * Determines the principal's name based on the configured principal attribute.
   *
   * @param jwt The JWT containing claims.
   * @return The principal's name.
   */
  private String getPrincipleClaimName(Jwt jwt) {
    // Default to 'sub' claim for principal name
    String claimName = JwtClaimNames.SUB;

    // Override with configured principal attribute
    if (principleAttribute != null) {
      claimName = principleAttribute;
    }
    return jwt.getClaim(claimName);
  }

  /**
   * Extracts custom roles for this application from the JWT.
   *
   * @param jwt The JWT containing claims.
   * @return A collection of granted authorities representing the roles.
   */
  private Collection<? extends GrantedAuthority> extractResourceRoles(Jwt jwt) {
    Map<String, Object> resourceAccess;
    Map<String, Object> resource;
    Collection<String> resourceRoles;

    // Check if the JWT contains 'resource_access' claim
    if (jwt.getClaim("resource_access") == null) {
      return Set.of(); // No resource roles available
    }
    resourceAccess = jwt.getClaim("resource_access");

    // Check if the resource ID exists in the 'resource_access' claim
    if (resourceAccess.get(resourceId) == null) {
      return Set.of(); // No roles for this resource
    }
    resource = (Map<String, Object>) resourceAccess.get(resourceId);

    // Extract roles from the resource and convert to GrantedAuthority objects
    resourceRoles = (Collection<String>) resource.get("roles");
    return resourceRoles.stream()
        .map(role -> new SimpleGrantedAuthority("ROLE_" + role)) // Prefix roles with 'ROLE_'
        .collect(Collectors.toSet());
  }
}
