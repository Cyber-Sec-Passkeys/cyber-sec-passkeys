package de.frankfurtuas.cybersec.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;

/**
 * Security configuration class for the application.
 * <p>
 * This class configures Spring Security to secure the application using OAuth2 and JWTs. It
 * enforces stateless session management and enables method-level security annotations.
 */
@Configuration
@EnableWebSecurity // Enables Spring Security for the application
@EnableMethodSecurity // Enables method-level security annotations like @PreAuthorize
public class SecurityConfig {

  private final JwtAuthConverter jwtAuthConverter;

  /**
   * Constructor for SecurityConfig.
   *
   * @param jwtAuthConverter JwtAuthConverter
   */
  SecurityConfig(final JwtAuthConverter jwtAuthConverter) {
    this.jwtAuthConverter = jwtAuthConverter;
  }

  /**
   * Configures the security filter chain for the application.
   *
   * @param http The HttpSecurity object to customize security behavior.
   * @return A configured SecurityFilterChain.
   * @throws Exception If any error occurs during configuration.
   */
  @Bean
  public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

    // Disable CSRF protection since the application is stateless (uses JWTs)
    // And require authentication for all requests
    http.csrf().disable().authorizeHttpRequests().anyRequest().authenticated();

    // Configure the application to use OAuth2 Resource Server with JWT authentication
    // And use custom JWT authentication converter
    http.oauth2ResourceServer().jwt().jwtAuthenticationConverter(jwtAuthConverter);

    // Enforce stateless session management (each request is independently authenticated)
    http.sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS);

    // Build and return the security filter chain
    return http.build();
  }
}
