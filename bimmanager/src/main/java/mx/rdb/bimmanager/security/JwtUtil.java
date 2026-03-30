package mx.rdb.bimmanager.security;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;

@Component
public class JwtUtil {

    // Generamos una llave secreta súper segura (En el mundo real esto se esconde en
    // variables de entorno)
    private static final Key SECRET_KEY = Keys.secretKeyFor(SignatureAlgorithm.HS256);

    // El pase VIP dura exactamente 24 horas (en milisegundos)
    private static final long EXPIRE_DURATION = 24 * 60 * 60 * 1000;

    // 1. Método para CREAR el Token
    public String generateToken(String email) {
        return Jwts.builder()
                .setSubject(email)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRE_DURATION))
                .signWith(SECRET_KEY)
                .compact();
    }

    // 2. Método para VALIDAR que el Token no sea falso ni esté expirado
    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder().setSigningKey(SECRET_KEY).build().parseClaimsJws(token);
            return true;
        } catch (Exception e) {
            System.out.println("Token inválido o expirado: " + e.getMessage());
            return false;
        }
    }

    // 3. Método para EXTRAER el email del Token
    public String getEmailFromToken(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(SECRET_KEY)
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }
}