import React, { useEffect, useState, useCallback } from "react";
import api from "../../services/api";

interface Calificacion {
    calificacionId: number;
    rating: number;
    comentario: string;
    createdAt: string;
    producto: { nombre: string };
}

export default function Resenas() {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const [resenas, setResenas] = useState<Calificacion[]>([]);

    // Se usa para cargar las reseñas del usuario autenticado
    const cargarResenas = useCallback(async () => {
        if (!user?.usuarioId) return;
        try {
            const res = await api.get(`/calificaciones/usuario/${user.usuarioId}`);
            setResenas(res.data.calificaciones);
        } catch (err) {
            console.error("Error al cargar las reseñas", err);
            setResenas([]);
        }
    }, [user?.usuarioId]); // dependencia agregada correctamente

    useEffect(() => {
        cargarResenas();
    }, [cargarResenas]);

    return (
        <div className="container mt-4">
            <h3 className="text-center mb-4">Mis Reseñas</h3>
            <table className="table table-striped text-center align-middle">
                <thead className="table-success">
                <tr>
                    <th>Producto</th>
                    <th>Rating</th>
                    <th>Comentario</th>
                    <th>Fecha</th>
                </tr>
                </thead>
                <tbody>
                {resenas.length > 0 ? (
                    resenas.map((r) => (
                        <tr key={r.calificacionId}>
                            <td>{r.producto.nombre}</td>
                            <td>{"⭐".repeat(r.rating)}</td>
                            <td>{r.comentario}</td>
                            <td>{new Date(r.createdAt).toLocaleDateString("es-GT")}</td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan={4} className="text-muted">
                            Aún no has realizado reseñas.
                        </td>
                    </tr>
                )}
                </tbody>
            </table>
        </div>
    );
}
