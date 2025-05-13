
package com.example.backend.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import com.example.backend.service.JwtService;

import java.io.IOException;

@Component
public class JwtFilter extends OncePerRequestFilter {

  private final JwtService jwtService;

  public JwtFilter(JwtService jwtService) {
    this.jwtService = jwtService;
  }

  @Override
  protected void doFilterInternal(HttpServletRequest request,
      HttpServletResponse response,
      FilterChain filterChain)
      throws ServletException, IOException {

    final String authHeader = request.getHeader("Authorization");

    if (authHeader != null && authHeader.startsWith("Bearer ")) {
      // Extract the token without "Bearer " prefix
      String token = authHeader.substring(7);

      try {
        // Use your JwtService to validate and get the username
        String username = jwtService.extractSubject(token);

        UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(username, null,
            null);

        authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
        SecurityContextHolder.getContext().setAuthentication(authentication);
      } catch (Exception e) {
        // Token is invalid, don't set authentication
        // Optionally log the error
      }
    }

    filterChain.doFilter(request, response);
  }
}
