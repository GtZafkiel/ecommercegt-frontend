import React from "react";

export default function ComunPanel() {
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    const features = [
        { title: "Publicar Productos", desc: "Crea publicaciones para vender artículos nuevos o usados.", icon: "bi-box-seam" },
        { title: "Tienda y Compras", desc: "Explora productos, agrégalos al carrito y realiza tus compras.", icon: "bi-cart4" },
        { title: "Gestión de Tarjetas", desc: "Registra o usa tarjetas guardadas para tus compras futuras.", icon: "bi-credit-card" },
        { title: "Mis Compras y Pedidos", desc: "Consulta el estado y la fecha de entrega de tus pedidos.", icon: "bi-truck" },
        { title: "Reseñas y Calificaciones", desc: "Evalúa los productos comprados y deja tus comentarios.", icon: "bi-star" },
    ];

    return (
        <div className="container py-5">
            <div className="text-center mb-4">
                <h2 className="fw-bold text-success">Bienvenido, {user.username}</h2>
                <p className="text-muted">Panel del Usuario Común</p>
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
                Se usa para orientar al usuario sobre las funciones principales del módulo común.
            </div>
        </div>
    );
}
