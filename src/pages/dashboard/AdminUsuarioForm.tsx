import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../services/api";

type Mode = "create" | "edit";

interface Props {
    mode: Mode;
}

interface EmpleadoForm {
    username: string;
    email: string;
    password?: string;
    role: "ADMIN" | "MODERADOR" | "LOGISTICA";
    estado: "ACTIVO" | "SUSPENDIDO";
}

export default function AdminUsuarioForm({ mode }: Props) {
    const navigate = useNavigate();
    const { usuarioId } = useParams();
    const isEdit = mode === "edit";

    const [form, setForm] = useState<EmpleadoForm>({
        username: "",
        email: "",
        password: "",
        role: "MODERADOR",
        estado: "ACTIVO",
    });
    const [loading, setLoading] = useState(false);
    const [mensaje, setMensaje] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    // Se usa para cargar datos del empleado en edición
    const cargarEmpleado = async () => {
        if (!isEdit || !usuarioId) return;
        try {
            setLoading(true);
            setError(null);
            const res = await api.get(`/admin/empleados/${usuarioId}`);
            const data = res.data;
            setForm({
                username: data.username || "",
                email: data.email || "",
                role: data.role || "MODERADOR",
                estado: data.estado || "ACTIVO",
            });
        } catch {
            setError("No se pudo cargar el empleado");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        cargarEmpleado();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [usuarioId]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    // Se usa para crear o actualizar el empleado
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMensaje(null);
        setError(null);

        try {
            setLoading(true);

            if (isEdit && usuarioId) {
                await api.put(`/admin/empleados/${usuarioId}`, {
                    username: form.username,
                    email: form.email,
                    role: form.role,
                    estado: form.estado,
                    ...(form.password ? { passwordHash: form.password } : {}),
                });
                setMensaje("Empleado actualizado correctamente");
            } else {
                await api.post("/admin/empleados", {
                    username: form.username,
                    email: form.email,
                    role: form.role,
                    estado: form.estado,
                    passwordHash: form.password,
                });
                setMensaje("Empleado creado correctamente");
            }

            setTimeout(() => navigate("/dashboard/admin/usuarios", { replace: true }), 1000);
        } catch (e: any) {
            setError("No se pudo guardar la información del empleado");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container py-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h4 className="mb-0">{isEdit ? "Editar empleado" : "Crear empleado"}</h4>
                <button className="btn btn-outline-secondary" onClick={() => navigate(-1)}>
                    <i className="bi bi-arrow-left me-1" /> Regresar
                </button>
            </div>

            {mensaje && <div className="alert alert-success py-2">{mensaje}</div>}
            {error && <div className="alert alert-danger py-2">{error}</div>}

            <div className="card shadow-sm">
                <div className="card-body">
                    <form onSubmit={handleSubmit}>
                        {/* Se usa para editar el nombre de usuario */}
                        <div className="mb-3">
                            <label className="form-label">Usuario</label>
                            <input
                                type="text"
                                className="form-control"
                                name="username"
                                value={form.username}
                                onChange={handleChange}
                                required
                                minLength={3}
                            />
                        </div>

                        {/* Se usa para editar el correo */}
                        <div className="mb-3">
                            <label className="form-label">Email</label>
                            <input
                                type="email"
                                className="form-control"
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {/* Se usa para seleccionar el rol */}
                        <div className="row">
                            <div className="mb-3 col-12 col-md-6">
                                <label className="form-label">Rol</label>
                                <select className="form-select" name="role" value={form.role} onChange={handleChange} required>
                                    <option value="ADMIN">ADMIN</option>
                                    <option value="MODERADOR">MODERADOR</option>
                                    <option value="LOGISTICA">LOGISTICA</option>
                                </select>
                            </div>

                            {/* Se usa para seleccionar el estado */}
                            <div className="mb-3 col-12 col-md-6">
                                <label className="form-label">Estado</label>
                                <select className="form-select" name="estado" value={form.estado} onChange={handleChange} required>
                                    <option value="ACTIVO">ACTIVO</option>
                                    <option value="SUSPENDIDO">SUSPENDIDO</option>
                                </select>
                            </div>
                        </div>

                        {/* Se usa para registrar la contraseña al crear o resetear en edición */}
                        <div className="mb-3">
                            <label className="form-label">{isEdit ? "Nueva contraseña (opcional)" : "Contraseña"}</label>
                            <input
                                type="password"
                                className="form-control"
                                name="password"
                                value={form.password || ""}
                                onChange={handleChange}
                                placeholder={isEdit ? "Dejar vacío para no cambiar" : "Mínimo 8 caracteres"}
                                {...(isEdit ? {} : { required: true, minLength: 8 })}
                            />
                            <div className="form-text">
                                {isEdit
                                    ? "Se usa para resetear la contraseña del empleado. Dejar vacío si no se desea cambiar."
                                    : "Se usa para registrar la contraseña inicial del empleado."}
                            </div>
                        </div>

                        <div className="d-flex gap-2">
                            <button type="submit" className="btn btn-success" disabled={loading}>
                                {loading ? "Guardando..." : isEdit ? "Actualizar" : "Crear"}
                            </button>
                            <button type="button" className="btn btn-outline-secondary" onClick={() => navigate("/dashboard/admin/usuarios")}>
                                Cancelar
                            </button>
                        </div>
                    </form>

                    <small className="text-muted d-block mt-3">
                        Se usa para crear o actualizar empleados con roles ADMIN, MODERADOR y LOGISTICA.
                    </small>
                </div>
            </div>
        </div>
    );
}
