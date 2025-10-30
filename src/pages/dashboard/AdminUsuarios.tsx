import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../services/api";

// Se usa para tipar un empleado en la tabla
interface Empleado {
    usuarioId: number;
    username: string;
    email: string;
    role: {
        role_id: number;
        code: string;
        name: string;
        description: string;
    };
    estado: "ACTIVO" | "SUSPENDIDO";
    createdAt?: string;
}

export default function AdminUsuarios() {
    const [empleados, setEmpleados] = useState<Empleado[]>([]);
    const [loading, setLoading] = useState(false);
    const [mensaje, setMensaje] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    const [usuariosComunes, setUsuariosComunes] = useState<Empleado[]>([]);


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
    // Se usa para cargar los usuarios comunes
    const cargarUsuariosComunes = async () => {
        try {
            const res = await api.get("/admin/empleados/comunes");
            setUsuariosComunes(res.data || []);
        } catch {
            console.error("No se pudieron cargar los usuarios comunes");
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
        cargarUsuariosComunes();
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
                        <table className="table table-striped table-hover align-middle text-center">
                            <thead className="table-dark">
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
                                        <td><span className="badge bg-primary">{emp.role?.name || "—"}</span></td>
                                        <td>
                        <span className={`badge ${emp.estado === "ACTIVO" ? "bg-success" : "bg-secondary"}`}>
                          {emp.estado}
                        </span>
                                        </td>
                                        <td className="text-end">
                                            <div className="btn-group">
                                                <button
                                                    className={`btn btn-sm d-none ${emp.estado === "ACTIVO" ? "btn-outline-secondary" : "btn-outline-success"}`}
                                                    onClick={() => cambiarEstado(emp.usuarioId, emp.estado === "ACTIVO" ? "SUSPENDIDO" : "ACTIVO")}
                                                >
                                                    {emp.estado === "ACTIVO" ? (
                                                        <>
                                                            <i className="bi bi-slash-circle me-1" /> Suspender
                                                        </>
                                                    ) : (
                                                        <>
                                                            <i className="bi bi-check2-circle me-1" /> Activar
                                                        </>
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

                </div>
            </div>

            <div className="mt-5">
                <h4 className="mb-3">Gestión de Usuarios Comunes</h4>

                <div className="card shadow-sm">
                    <div className="card-body">
                        <div className="table-responsive">
                            <table className="table table-striped table-hover align-middle text-center">
                                <thead className="table-dark">
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
                                {usuariosComunes.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="text-center">Sin registros</td>
                                    </tr>
                                ) : (
                                    usuariosComunes.map((u, i) => (
                                        <tr key={u.usuarioId}>
                                            <td>{i + 1}</td>
                                            <td>{u.username}</td>
                                            <td>{u.email}</td>
                                            <td>
                                                <span className="badge bg-secondary">{u.role?.name || "—"}</span>
                                            </td>
                                            <td>
                    <span className={`badge ${u.estado === "ACTIVO" ? "bg-success" : "bg-secondary"}`}>
                      {u.estado}
                    </span>
                                            </td>
                                            <td className="text-end">
                                                <div className="btn-group">
                                                    <button
                                                        className={`btn btn-sm d-none ${u.estado === "ACTIVO" ? "btn-outline-secondary" : "btn-outline-success"}`}
                                                        onClick={() => cambiarEstado(u.usuarioId, u.estado === "ACTIVO" ? "SUSPENDIDO" : "ACTIVO")}
                                                    >
                                                        {u.estado === "ACTIVO" ? (
                                                            <>
                                                                <i className="bi bi-slash-circle me-1" /> Suspender
                                                            </>
                                                        ) : (
                                                            <>
                                                                <i className="bi bi-check2-circle me-1" /> Activar
                                                            </>
                                                        )}
                                                    </button>
                                                    <button
                                                        className="btn btn-sm btn-outline-primary"
                                                        onClick={() => navigate(`/dashboard/admin/usuarios/editar/${u.usuarioId}`)}
                                                    >
                                                        <i className="bi bi-pencil-square me-1" /> Editar
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
}
