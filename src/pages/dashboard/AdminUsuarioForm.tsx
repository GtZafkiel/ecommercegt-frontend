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
    roleId: number; //
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
        roleId: 2, // por defecto MODERADOR
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
                roleId: data.role?.role_id || 2,
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
        setForm(prev => ({
            ...prev,
            [name]: name === "roleId" ? parseInt(value) : value,
        }));
    };

    // Se usa para crear o actualizar el empleado
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMensaje(null);
        setError(null);

        try {
            setLoading(true);

            const payload = {
                username: form.username,
                email: form.email,
                password: form.password,
                estado: form.estado,
                roleId: form.roleId,
            };


            console.log("Payload enviado al backend:", JSON.stringify(payload, null, 2));

            if (isEdit && usuarioId) {
                await api.put(`/admin/empleados/${usuarioId}`, payload);
                setMensaje("Empleado actualizado correctamente");
            } else {
                await api.post("/admin/empleados", payload);
                setMensaje("Empleado creado correctamente");
            }

            setTimeout(() => navigate("/dashboard/admin/usuarios", { replace: true }), 1000);
        } catch {
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
                        {/* Usuario */}
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

                        {/* Email */}
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

                        {/* Rol y Estado */}
                        <div className="row">
                            <div className="mb-3 col-12 col-md-6">
                                <label className="form-label">Rol</label>
                                <select
                                    className="form-select"
                                    name="roleId"
                                    value={form.roleId}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value={1}>ADMIN</option>
                                    <option value={2}>MODERADOR</option>
                                    <option value={3}>LOGISTICA</option>
                                </select>
                            </div>

                            <div className="mb-3 col-12 col-md-6">
                                <label className="form-label">Estado</label>
                                <select
                                    className="form-select"
                                    name="estado"
                                    value={form.estado}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="ACTIVO">ACTIVO</option>
                                    <option value="SUSPENDIDO">SUSPENDIDO</option>
                                </select>
                            </div>
                        </div>

                        {/* Contraseña */}
                        <div className="mb-3">
                            <label className="form-label">
                                {isEdit ? "Nueva contraseña (opcional)" : "Contraseña"}
                            </label>
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
                                    : ""}
                            </div>
                        </div>

                        <div className="d-flex gap-2">
                            <button type="submit" className="btn btn-success" disabled={loading}>
                                {loading ? "Guardando..." : isEdit ? "Actualizar" : "Crear"}
                            </button>
                            <button
                                type="button"
                                className="btn btn-outline-secondary"
                                onClick={() => navigate("/dashboard/admin/usuarios")}
                            >
                                Cancelar
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
