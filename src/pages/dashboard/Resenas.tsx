import React, { useEffect, useState } from "react";
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

    useEffect(() => {
        if (user?.usuarioId) cargarResenas();
    }, []);

    async function cargarResenas() {
        const res = await api.get(`/calificaciones/usuario/${user.usuarioId}`);
        setResenas(res.data.calificaciones);
    }

    return (
        <div className="container mt-4">
            <h3 className="text-center mb-4">Mis Reseñas</h3>
            <table className="table table-striped text-center">
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
                        <td colSpan={4}>Aún no has realizado reseñas.</td>
                    </tr>
                )}
                </tbody>
            </table>
        </div>
    );
}
