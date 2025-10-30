import React from "react";

export default function LogisticaPanel() {
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    const features = [
        { title: "Pedidos en Curso", desc: "Consulta los pedidos que aún no se han entregado.", icon: "bi-list-ul" },
        { title: "Actualizar Estado", desc: "Marca pedidos como entregados o modifica la fecha de entrega.", icon: "bi-truck" },
        { title: "Gestión de Rutas", desc: "Supervisa y controla las entregas de forma organizada.", icon: "bi-geo-alt" },
    ];

    return (
        <div className="container py-5">
            <div className="text-center mb-4">
                <h2 className="fw-bold text-success">Bienvenido, {user.username}</h2>
                <p className="text-muted">Panel de Logística</p>
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
                Se usa para verificar pedidos y mantener un control eficiente de entregas.
            </div>
        </div>
    );
}
