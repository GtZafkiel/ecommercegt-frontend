import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../services/api";

// Se usa para tipar un empleado en la tabla
interface Empleado {
    usuarioId: number;
    username: string;
    email: string;
    role: "ADMIN" | "MODERADOR" | "LOGISTICA";
    estado: "ACTIVO" | "SUSPENDIDO";
    createdAt?: string;
}

export default function AdminUsuarios() {
    const [empleados, setEmpleados] = useState<Empleado[]>([]);
    const [loading, setLoading] = useState(false);
    const [mensaje, setMensaje] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    // Se usa para cargar la lista de empleados
    const cargarEmpleados = async () => {
        try {
            setLoading(true);
            setError(null);
            const res = await api.get("/admin/empleados");
            setEmpleados(res.data || []);
        } catch {
            setError("No se pudo cargar la lista de empleados");
        } finally {
            setLoading(false);
        }
    };

    // Se usa para cambiar el estado ACTIVO/SUSPENDIDO
    const cambiarEstado = async (usuarioId: number, estado: "ACTIVO" | "SUSPENDIDO") => {
        try {
            setLoading(true);
            setError(null);
            await api.patch(`/admin/empleados/${usuarioId}/estado`, { estado });
            setMensaje("Estado actualizado correctamente");
            await cargarEmpleados();
        } catch {
            setError("No se pudo actualizar el estado del empleado");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        cargarEmpleados();
    }, []);

    return (
        <div className="container py-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h4 className="mb-0">Gestión de Empleados</h4>
                <Link to="/dashboard/admin/usuarios/nuevo" className="btn btn-success">
                    <i className="bi bi-person-plus me-1" />
                    Crear usuario
                </Link>
            </div>

            {mensaje && <div className="alert alert-success py-2">{mensaje}</div>}
            {error && <div className="alert alert-danger py-2">{error}</div>}

            <div className="card shadow-sm">
                <div className="card-body">
                    <div className="table-responsive">
                        <table className="table table-hover align-middle">
                            <thead className="table-light">
                            <tr>
                                <th>#</th>
                                <th>Usuario</th>
                                <th>Email</th>
                                <th>Rol</th>
                                <th>Estado</th>
                                <th className="text-end">Acciones</th>
                            </tr>
                            </thead>
                            <tbody>
                            {loading ? (
                                <tr><td colSpan={6} className="text-center">Cargando...</td></tr>
                            ) : empleados.length === 0 ? (
                                <tr><td colSpan={6} className="text-center">Sin registros</td></tr>
                            ) : (
                                empleados.map((emp, idx) => (
                                    <tr key={emp.usuarioId}>
                                        <td>{idx + 1}</td>
                                        <td>{emp.username}</td>
                                        <td>{emp.email}</td>
                                        <td><span className="badge bg-primary">{emp.role}</span></td>
                                        <td>
                        <span className={`badge ${emp.estado === "ACTIVO" ? "bg-success" : "bg-secondary"}`}>
                          {emp.estado}
                        </span>
                                        </td>
                                        <td className="text-end">
                                            <div className="btn-group">
                                                <button
                                                    className={`btn btn-sm ${emp.estado === "ACTIVO" ? "btn-outline-secondary" : "btn-outline-success"}`}
                                                    onClick={() => cambiarEstado(emp.usuarioId, emp.estado === "ACTIVO" ? "SUSPENDIDO" : "ACTIVO")}
                                                >
                                                    {emp.estado === "ACTIVO" ? (
                                                        <><i className="bi bi-slash-circle me-1" />Suspender</>
                                                    ) : (
                                                        <><i className="bi bi-check2-circle me-1" />Activar</>
                                                    )}
                                                </button>

                                                <button
                                                    className="btn btn-sm btn-outline-primary"
                                                    onClick={() => navigate(`/dashboard/admin/usuarios/editar/${emp.usuarioId}`)}
                                                >
                                                    <i className="bi bi-pencil-square me-1" />
                                                    Editar
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                            </tbody>
                        </table>
                    </div>

                    <small className="text-muted">
                        Se usa para visualizar, activar, suspender y editar empleados.
                    </small>
                </div>
            </div>
        </div>
    );
}
