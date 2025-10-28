import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../services/api";

interface Producto {
    productoId: number;
    nombre: string;
    descripcion: string;
    imagenUrl: string;
    precio: number;
    stock: number;
    estado: string;
}

interface Calificacion {
    calificacionId: number;
    rating: number;
    comentario: string;
    usuario: { username: string };
    createdAt: string;
}

export default function DetalleProducto() {
    const { id } = useParams<{ id: string }>();
    const [producto, setProducto] = useState<Producto | null>(null);
    const [calificaciones, setCalificaciones] = useState<Calificacion[]>([]);
    const [promedio, setPromedio] = useState<number>(0);
    const [ratingNuevo, setRatingNuevo] = useState<number>(0);
    const [comentarioNuevo, setComentarioNuevo] = useState<string>("");
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    useEffect(() => {
        if (id) {
            cargarProducto(Number(id));
            cargarCalificaciones(Number(id));
        }
    }, [id]);

    async function cargarProducto(productoId: number) {
        try {
            const res = await api.get(`/productos/${productoId}`);
            setProducto(res.data);
        } catch (err) {
            console.error("Error al cargar el producto:", err);
        }
    }

    async function cargarCalificaciones(productoId: number) {
        try {
            const res = await api.get(`/calificaciones/producto/${productoId}`);
            setCalificaciones(res.data.calificaciones);
            setPromedio(res.data.promedio);
        } catch (err) {
            console.error("Error al cargar las calificaciones:", err);
        }
    }

    async function enviarCalificacion() {
        if (ratingNuevo < 1 || ratingNuevo > 5 || comentarioNuevo.trim() === "") {
            alert("Debe ingresar una calificación entre 1 y 5 estrellas y un comentario.");
            return;
        }

        try {
            await api.post("/calificaciones", {
                productoId: id,
                usuarioId: user.usuarioId,
                rating: ratingNuevo,
                comentario: comentarioNuevo,
            });

            setRatingNuevo(0);
            setComentarioNuevo("");
            cargarCalificaciones(Number(id));
            alert("Calificación enviada correctamente.");
        } catch (err: any) {
            console.error("Error al enviar la calificación:", err);
            alert(err.response?.data?.message || "Error al enviar la calificación.");
        }
    }

    return (
        <div className="container my-4">
            {producto ? (
                <div className="card shadow-sm p-4 mb-4">
                    <div className="row g-3">
                        <div className="col-md-5 text-center">
                            <img
                                src={producto.imagenUrl}
                                alt={producto.nombre}
                                className="img-fluid rounded border"
                                style={{ maxHeight: "350px", objectFit: "cover" }}
                            />
                        </div>
                        <div className="col-md-7">
                            <h3 className="fw-bold">{producto.nombre}</h3>
                            <p>{producto.descripcion}</p>
                            <p className="text-primary fw-bold">Precio: Q{producto.precio.toFixed(2)}</p>
                            <p>
                                <strong>Estado:</strong> {producto.estado} <br />
                                <strong>Stock:</strong> {producto.stock}
                            </p>
                            <div className="mt-3">
                                <strong>Promedio general: </strong>
                                {promedio > 0 ? (
                                    <>
                                        <span className="text-warning fw-bold">{promedio.toFixed(1)}</span> ⭐
                                    </>
                                ) : (
                                    " Sin calificaciones"
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <p>Cargando producto...</p>
            )}

            {/* Formulario de nueva calificación */}
            <div className="card shadow-sm p-3 mb-4">
                <h5 className="mb-3">Tu opinión</h5>
                <div className="d-flex align-items-center mb-2">
                    {[1, 2, 3, 4, 5].map((n) => (
                        <i
                            key={n}
                            className={`bi bi-star-fill fs-4 mx-1 ${
                                n <= ratingNuevo ? "text-warning" : "text-secondary"
                            }`}
                            style={{ cursor: "pointer" }}
                            onClick={() => setRatingNuevo(n)}
                        ></i>
                    ))}
                </div>
                <textarea
                    className="form-control mb-2"
                    placeholder="Escribe tu comentario..."
                    value={comentarioNuevo}
                    onChange={(e) => setComentarioNuevo(e.target.value)}
                ></textarea>
                <button className="btn btn-primary" onClick={enviarCalificacion}>
                    Enviar Calificación
                </button>
            </div>

            {/* Lista de reseñas */}
            <div className="card shadow-sm p-3">
                <h5 className="mb-3">Reseñas de otros usuarios</h5>
                {calificaciones.length > 0 ? (
                    calificaciones.map((r) => (
                        <div key={r.calificacionId} className="border rounded p-3 mb-3">
                            <div>
                                {"⭐".repeat(r.rating)}{" "}
                                <small className="text-muted">({r.rating}/5)</small>
                            </div>
                            <p className="mb-1">{r.comentario}</p>
                            <small className="text-muted">
                                {r.usuario?.username || "Anónimo"} •{" "}
                                {new Date(r.createdAt).toLocaleDateString()}
                            </small>
                        </div>
                    ))
                ) : (
                    <p className="text-muted">Aún no hay reseñas para este producto.</p>
                )}
            </div>
        </div>
    );
}
