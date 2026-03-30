package mx.rdb.bimmanager.repositories;

import mx.rdb.bimmanager.models.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    // Este método es oro puro: Spring Boot hará la consulta SQL automáticamente
    // para buscar por correo
    Optional<Usuario> findByEmail(String email);
}