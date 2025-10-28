import React, { useEffect, useState } from "react";
import api from "../../services/api";

interface Usuario {
    usuarioId: number;
    username: string;
    email: string;
    estado: string;
}

export default function Sanciones() {
    const [usuarios, setUsuarios] = useState<Usuario[]>([]);
    const [mensaje, setMensaje] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    // Se usa para obtener los usuarios comunes
    const cargarUsuarios = async () => {
        setLoading(true);
        try {
            const res = await api.get("/moderador/usuarios");
            setUsuarios(res.data);
        } catch (err) {
            setError("Error al cargar usuarios comunes.");
        } finally {
            setLoading(false);
        }
    };

    // Se usa para cambiar el estado del usuario
    const cambiarEstado = async (id: number) => {
        try {
            const res = await api.put(`/moderador/usuarios/${id}/estado`);
            setMensaje(res.data);
            cargarUsuarios();
        } catch (err) {
            setError("Error al cambiar el estado del usuario.");
        }
    };

    useEffect(() => {
        cargarUsuarios();
    }, []);

    return (
        <div className="container mt-4">
            <h3 className="mb-3 text-center">Gestión de Sanciones</h3>

            {loading && <div className="alert alert-info">Cargando usuarios...</div>}
            {mensaje && <div className="alert alert-success">{mensaje}</div>}
            {error && <div className="alert alert-danger">{error}</div>}

            <table className="table table-bordered table-striped mt-3">
                <thead className="table-dark text-center">
                <tr>
                    <th>ID</th>
                    <th>Usuario</th>
                    <th>Email</th>
                    <th>Estado</th>
                    <th>Acción</th>
                </tr>
                </thead>
                <tbody className="text-center">
                {usuarios.length > 0 ? (
                    usuarios.map((u) => (
                        <tr key={u.usuarioId}>
                            <td>{u.usuarioId}</td>
                            <td>{u.username}</td>
                            <td>{u.email}</td>
                            <td>
                  <span
                      className={`badge ${
                          u.estado === "ACTIVO" ? "bg-success" : "bg-danger"
                      }`}
                  >
                    {u.estado}
                  </span>
                            </td>
                            <td>
                                <button
                                    className={`btn ${
                                        u.estado === "ACTIVO" ? "btn-warning" : "btn-success"
                                    } btn-sm`}
                                    onClick={() => cambiarEstado(u.usuarioId)}
                                >
                                    {u.estado === "ACTIVO" ? "Suspender" : "Reactivar"}
                                </button>
                            </td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan={5}>No hay usuarios comunes registrados.</td>
                    </tr>
                )}
                </tbody>
            </table>
        </div>
    );
}
