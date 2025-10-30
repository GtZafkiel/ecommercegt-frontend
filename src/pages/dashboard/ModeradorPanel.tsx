import React from "react";

export default function ModeradorPanel() {
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    const features = [
        { title: "Revisión de Productos", desc: "Aprueba o rechaza productos enviados por los usuarios.", icon: "bi-check2-square" },
        { title: "Gestión de Sanciones", desc: "Controla sanciones para mantener la seguridad en las ventas.", icon: "bi-exclamation-triangle" },
        { title: "Control de Calidad", desc: "Supervisa que los productos cumplan las políticas del sistema.", icon: "bi-shield-check" },
    ];

    return (
        <div className="container py-5">
            <div className="text-center mb-4">
                <h2 className="fw-bold text-success">Bienvenido, {user.username}</h2>
                <p className="text-muted">Panel del Moderador</p>
            </div>

            <div className="row g-4">
                {features.map((f, i) => (
                    <div key={i} className="col-md-4">
                        <div className="card h-100 shadow-sm border-0">
                            <div className="card-body text-center">
                                <i className={`bi ${f.icon} fs-1 text-success mb-3`}></i>
                                <h5 className="card-title">{f.title}</h5>
                                <p className="card-text text-secondary">{f.desc}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="alert alert-success mt-4">
                Se usa para validar productos y mantener el control del contenido publicado.
            </div>
        </div>
    );
}
