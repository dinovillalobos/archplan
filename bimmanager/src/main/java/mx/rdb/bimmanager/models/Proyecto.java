package mx.rdb.bimmanager.models;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data // La magia de Lombok: genera getters, setters y constructores automáticamente
@Entity
@Table(name = "proyectos")
public class Proyecto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nombre;

    @Column(nullable = false)
    private String cliente;

    @Column(columnDefinition = "TEXT")
    private String descripcion;

    @Column(nullable = false)
    private String estado; // Ej: "PLANIFICACION", "EJECUCION", "ENTREGADO"

    @Column(name = "fecha_creacion", updatable = false)
    private LocalDateTime fechaCreacion;

    @PrePersist
    protected void onCreate() {
        this.fechaCreacion = LocalDateTime.now();
    }
}