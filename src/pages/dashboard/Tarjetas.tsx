import React, { useEffect, useState, useCallback } from "react";
import api from "../../services/api";

export default function Tarjetas() {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const [tarjetas, setTarjetas] = useState<any[]>([]);
    const [formData, setFormData] = useState({
        numero: "",
        nombreTitular: "",
        expiracion: "",
        cvv: "",
        tipo: "VISA",
    });

    const [loading, setLoading] = useState(false);
    const [mensaje, setMensaje] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    // ============================================================
    // Cargar tarjetas
    // ============================================================
    const cargarTarjetas = useCallback(async () => {
        if (!user?.usuarioId) {
            setError("Usuario no identificado. Inicia sesión nuevamente.");
            return;
        }
        setLoading(true);
        try {
            const res = await api.get(`/tarjetas/usuario/${user.usuarioId}`);
            setTarjetas(res.data);
        } catch {
            setError("Error al cargar las tarjetas.");
        } finally {
            setLoading(false);
        }
    }, [user?.usuarioId]); // dependencia agregada correctamente

    useEffect(() => {
        cargarTarjetas();
    }, [cargarTarjetas]);

    // ============================================================
    // Manejadores de formulario
    // ============================================================
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setMensaje(null);

        try {
            const payload = {
                ...formData,
                usuario: { usuarioId: user.usuarioId },
            };

            await api.post("/tarjetas", payload);
            setMensaje("Tarjeta registrada correctamente.");
            setFormData({
                numero: "",
                nombreTitular: "",
                expiracion: "",
                cvv: "",
                tipo: "VISA",
            });
            cargarTarjetas();
        } catch (err: any) {
            console.error(err);
            const msg = err.response?.data || "Error al registrar la tarjeta.";
            setError(typeof msg === "string" ? msg : "Error al registrar la tarjeta.");
        }
    };

    const handleEliminar = async (id: number) => {
        if (!window.confirm("¿Eliminar esta tarjeta?")) return;
        try {
            await api.delete(`/tarjetas/${id}`);
            setMensaje("Tarjeta eliminada correctamente.");
            cargarTarjetas();
        } catch {
            setError("Error al eliminar la tarjeta.");
        }
    };

    // ============================================================
    // Renderizado
    // ============================================================
    return (
        <div className="container mt-4">
            <h2 className="mb-4">Mis Tarjetas</h2>

            {mensaje && <div className="alert alert-success">{mensaje}</div>}
            {error && <div className="alert alert-danger">{error}</div>}

            {/* Formulario */}
            <form className="border p-4 bg-light rounded shadow-sm mb-4" onSubmit={handleSubmit}>
                <div className="row">
                    <div className="col-md-3 mb-3">
                        <label className="form-label fw-semibold">Número de Tarjeta</label>
                        <input
                            type="text"
                            name="numero"
                            className="form-control"
                            maxLength={16}
                            minLength={13}
                            required
                            value={formData.numero}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="col-md-3 mb-3">
                        <label className="form-label fw-semibold">Nombre del Titular</label>
                        <input
                            type="text"
                            name="nombreTitular"
                            className="form-control"
                            required
                            value={formData.nombreTitular}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="col-md-2 mb-3">
                        <label className="form-label fw-semibold">Expiración (MM/AA)</label>
                        <input
                            type="text"
                            name="expiracion"
                            className="form-control"
                            placeholder="09/27"
                            required
                            value={formData.expiracion}
                            onChange={handleChange}
                        />
                    </div>

                    {/* Campo nuevo: CVV */}
                    <div className="col-md-1 mb-3">
                        <label className="form-label fw-semibold">CVV</label>
                        <input
                            type="password"
                            name="cvv"
                            className="form-control text-center"
                            maxLength={4}
                            required
                            value={formData.cvv}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="col-md-3 mb-3">
                        <label className="form-label fw-semibold">Tipo</label>
                        <select
                            name="tipo"
                            className="form-select"
                            value={formData.tipo}
                            onChange={handleChange}
                        >
                            <option value="VISA">VISA</option>
                            <option value="MASTERCARD">MASTERCARD</option>
                            <option value="AMERICAN EXPRESS">AMERICAN EXPRESS</option>
                            <option value="DISCOVER">DISCOVER</option>
                            <option value="BITCOIN">BITCOIN</option>
                        </select>
                    </div>
                </div>

                <div className="text-end">
                    <button type="submit" className="btn btn-primary">
                        Guardar Tarjeta
                    </button>
                </div>
            </form>

            {/* Listado */}
            {loading ? (
                <div className="text-center py-5">
                    <div className="spinner-border text-primary" role="status"></div>
                </div>
            ) : tarjetas.length > 0 ? (
                <table className="table table-hover table-bordered align-middle">
                    <thead className="table-dark text-center">
                    <tr>
                        <th>ID</th>
                        <th>Número</th>
                        <th>Titular</th>
                        <th>Expiración</th>
                        <th>Tipo</th>
                        <th>Acción</th>
                    </tr>
                    </thead>
                    <tbody>
                    {tarjetas.map((t) => (
                        <tr key={t.tarjetaId}>
                            <td className="text-center">{t.tarjetaId}</td>
                            <td>•••• •••• •••• {t.numero.slice(-4)}</td>
                            <td>{t.nombreTitular}</td>
                            <td className="text-center">{t.expiracion}</td>
                            <td className="text-center">{t.tipo}</td>
                            <td className="text-center">
                                <button
                                    className="btn btn-sm btn-outline-danger"
                                    onClick={() => handleEliminar(t.tarjetaId)}
                                >
                                    Eliminar
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            ) : (
                <div className="alert alert-info">No tienes tarjetas registradas.</div>
            )}
        </div>
    );
}
