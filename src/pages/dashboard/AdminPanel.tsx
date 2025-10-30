import React from "react";

export default function AdminPanel() {
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    const features = [
        { title: "Gestión de Empleados", desc: "Registra, actualiza o consulta moderadores, logística y administradores.", icon: "bi-people-fill" },
        { title: "Reportes Generales", desc: "Consulta estadísticas sobre ventas, clientes y productos más vendidos.", icon: "bi-graph-up" },
        { title: "Historial del Sistema", desc: "Revisa sanciones, notificaciones y operaciones registradas.", icon: "bi-clock-history" },
    ];

    return (
        <div className="container py-5">
            <div className="text-center mb-4">
                <h2 className="fw-bold text-success">Bienvenido, {user.username}</h2>
                <p className="text-muted">Panel del Administrador</p>
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
                Se usa para supervisar la administración general del sistema y generar reportes.
            </div>
        </div>
    );
}
