package mx.rdb.bimmanager.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                // Apagamos la protección CSRF porque usaremos Tokens, no cookies tradicionales
                .csrf(csrf -> csrf.disable())

                // Le decimos que no guarde sesiones en la memoria (Stateless)
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

                // Configuramos las reglas de las puertas
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/auth/**").permitAll() // La ruta de login/registro es pública
                        .requestMatchers("/api/documentos/ver/**").permitAll() // Dejamos que el PDF se vea en el
                                                                               // navegador
                        .anyRequest().authenticated() // CUALQUIER otra cosa requiere el pase VIP
                );

        return http.build();
    }

    // Esta es la herramienta para encriptar contraseñas antes de guardarlas en
    // PostgreSQL
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}