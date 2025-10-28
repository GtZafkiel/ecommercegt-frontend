import React, { useEffect, useState } from "react";
import api from "../../services/api";

export default function MisCompras() {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const [ventas, setVentas] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const cargarVentas = async () => {
            setLoading(true);
            try {
                const res = await api.get(`/ventas/usuario/${user.usuarioId}`);
                setVentas(Array.isArray(res.data) ? res.data : []); // 🔹 validación
            } catch {
                setError("Error al cargar tus compras.");
            } finally {
                setLoading(false);
            }
        };

        cargarVentas();
    }, []);

    return (
        <div className="container mt-4">
            <h2 className="mb-4">Mis Compras</h2>

            {error && <div className="alert alert-danger">{error}</div>}

            {loading ? (
                <div className="text-center py-5">
                    <div className="spinner-border text-primary" role="status"></div>
                    <p className="mt-3">Cargando tus compras...</p>
                </div>
            ) : ventas.length > 0 ? (
                <table className="table table-hover table-bordered align-middle shadow-sm">
                    <thead className="table-dark text-center">
                    <tr>
                        <th>ID Venta</th>
                        <th>Fecha</th>
                        <th>Total</th>
                        <th>Método de Pago</th>
                    </tr>
                    </thead>
                    <tbody>
                    {ventas.map((v) => (
                        <tr key={v.ventaId}>
                            <td className="text-center fw-bold">{v.ventaId}</td>
                            <td>{new Date(v.createdAt).toLocaleString()}</td>
                            <td className="text-end text-success fw-semibold">
                                Q{v.total.toFixed(2)}
                            </td>
                            <td className="text-center">{v.metodoPago}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            ) : (
                <div className="alert alert-info">
                    Aún no has realizado ninguna compra.
                </div>
            )}
        </div>
    );
}
