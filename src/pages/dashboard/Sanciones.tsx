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

    // Estado del modal
    const [mostrarModal, setMostrarModal] = useState<boolean>(false);
    const [motivo, setMotivo] = useState<string>("");
    const [usuarioSeleccionado, setUsuarioSeleccionado] = useState<Usuario | null>(null);

    // Cargar usuarios comunes
    const cargarUsuarios = async () => {
        setLoading(true);
        try {
            const res = await api.get("/moderador/usuarios");
            setUsuarios(res.data);
        } catch {
            setError("Error al cargar usuarios comunes.");
        } finally {
            setLoading(false);
        }
    };

    // Abrir modal con usuario seleccionado
    const abrirModal = (usuario: Usuario) => {
        setUsuarioSeleccionado(usuario);
        setMotivo("");
        setMostrarModal(true);
    };

    // Confirmar sanción
    const confirmarCambio = async () => {
        if (!usuarioSeleccionado) return;

        try {
            const res = await api.post(
                `/moderador/usuarios/${usuarioSeleccionado.usuarioId}/sancion`,
                { motivo }
            );
            setMensaje(res.data);
            setMostrarModal(false);
            await cargarUsuarios();
        } catch {
            setError("Error al aplicar la sanción.");
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
                                            u.estado === "ACTIVO"
                                                ? "bg-success"
                                                : "bg-danger"
                                        }`}
                                    >
                                        {u.estado}
                                    </span>
                            </td>
                            <td>
                                <button
                                    className={`btn ${
                                        u.estado === "ACTIVO"
                                            ? "btn-warning"
                                            : "btn-success"
                                    } btn-sm`}
                                    onClick={() => abrirModal(u)}
                                >
                                    {u.estado === "ACTIVO"
                                        ? "Suspender"
                                        : "Reactivar"}
                                </button>
                            </td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan={5}>
                            No hay usuarios comunes registrados.
                        </td>
                    </tr>
                )}
                </tbody>
            </table>

            {/* Modal controlado por React */}
            {mostrarModal && (
                <div
                    className="modal fade show"
                    style={{ display: "block", background: "rgba(0,0,0,0.5)" }}
                >
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content shadow">
                            <div className="modal-header">
                                <h5 className="modal-title">
                                    {usuarioSeleccionado?.estado === "ACTIVO"
                                        ? "Motivo de suspensión"
                                        : "Motivo de reactivación"}
                                </h5>
                                <button
                                    className="btn-close"
                                    onClick={() => setMostrarModal(false)}
                                ></button>
                            </div>
                            <div className="modal-body">
                                <textarea
                                    className="form-control"
                                    rows={3}
                                    placeholder="Escriba el motivo..."
                                    value={motivo}
                                    onChange={(e) => setMotivo(e.target.value)}
                                ></textarea>
                            </div>
                            <div className="modal-footer">
                                <button
                                    className="btn btn-secondary"
                                    onClick={() => setMostrarModal(false)}
                                >
                                    Cancelar
                                </button>
                                <button
                                    className="btn btn-primary"
                                    onClick={confirmarCambio}
                                    disabled={!motivo.trim()}
                                >
                                    Confirmar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
