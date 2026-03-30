package mx.rdb.bimmanager.controllers; // ¡Ajusta tu paquete!

import mx.rdb.bimmanager.models.Usuario;
import mx.rdb.bimmanager.repositories.UsuarioRepository;
import mx.rdb.bimmanager.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*") // Permitimos que React nos hable
public class AuthController {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    // --- Clases internas para recibir y enviar datos rápidamente (DTOs) ---
    public static class AuthRequest {
        public String email;
        public String password;
    }

    public static class AuthResponse {
        public String token;

        public AuthResponse(String token) {
            this.token = token;
        }
    }

    // 1. RUTA PARA REGISTRAR UN NUEVO ARQUITECTO
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody AuthRequest request) {
        // Revisamos si el correo ya existe
        if (usuarioRepository.findByEmail(request.email).isPresent()) {
            return ResponseEntity.badRequest().body("El email ya está registrado");
        }

        Usuario nuevoUsuario = new Usuario();
        nuevoUsuario.setEmail(request.email);
        // ¡Magia! Encriptamos la contraseña antes de guardarla en PostgreSQL
        nuevoUsuario.setPassword(passwordEncoder.encode(request.password));
        nuevoUsuario.setRol("ADMIN"); // Por defecto le damos permisos totales

        usuarioRepository.save(nuevoUsuario);
        return ResponseEntity.ok("Usuario registrado exitosamente");
    }

    // 2. RUTA PARA INICIAR SESIÓN Y OBTENER EL TOKEN
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthRequest request) {
        // Buscamos al usuario en la base de datos
        Usuario usuario = usuarioRepository.findByEmail(request.email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        // Comparamos la contraseña encriptada
        if (passwordEncoder.matches(request.password, usuario.getPassword())) {
            // Si la contraseña es correcta, la fábrica imprime el Token JWT
            String token = jwtUtil.generateToken(usuario.getEmail());
            return ResponseEntity.ok(new AuthResponse(token));
        } else {
            return ResponseEntity.status(401).body("Contraseña incorrecta");
        }
    }
}