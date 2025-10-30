import React, { useEffect, useState } from "react";
import api from "../../services/api";
import DetallePedidoModal from "./DetallePedidoModal";

interface Pedido {
    pedidoId: number;
    fechaEnvio: string;
    fechaEntrega?: string | null;
    estado: string;
    total: number;
}

export default function Pedidos() {
    const [pedidos, setPedidos] = useState<Pedido[]>([]);
    const [pedidoSeleccionado, setPedidoSeleccionado] = useState<Pedido | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        cargarPedidos();
    }, []);

    async function cargarPedidos() {
        setLoading(true);
        try {
            const user = JSON.parse(localStorage.getItem("user") || "{}");
            if (!user?.usuarioId) return;

            const res = await api.get(`/pedidos/usuario/${user.usuarioId}`);
            setPedidos(res.data);
        } catch (err) {
            console.error("Error al cargar los pedidos:", err);
        } finally {
            setLoading(false);
        }
    }

    // ============================================
    // Formatear fechas al estilo dd/mm/yyyy
    // ============================================
    const formatearFecha = (fecha?: string | null) => {
        if (!fecha) return "Pendiente";
        const d = new Date(fecha);
        return d.toLocaleDateString("es-GT", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
        });
    };

    return (
        <div className="container mt-4">
            <h3 className="mb-3">Mis Pedidos</h3>

            {loading ? (
                <div className="text-center py-4">
                    <div className="spinner-border text-primary" role="status"></div>
                </div>
            ) : pedidos.length > 0 ? (
                <table className="table table-striped table-hover align-middle text-center">
                    <thead className="table-dark">
                    <tr>
                        <th>ID</th>
                        <th>Fecha Envío</th>
                        <th>Fecha Entrega</th>
                        <th>Estado</th>
                        <th>Total (Q)</th>
                        <th>Acciones</th>
                    </tr>
                    </thead>
                    <tbody>
                    {pedidos.map((p) => (
                        <tr key={p.pedidoId}>
                            <td>{p.pedidoId}</td>
                            <td>{formatearFecha(p.fechaEnvio)}</td>
                            <td>{formatearFecha(p.fechaEntrega)}</td>
                            <td>
                  <span
                      className={`badge ${
                          p.estado === "ENTREGADO"
                              ? "bg-success"
                              : "bg-warning text-dark"
                      }`}
                  >
                    {p.estado}
                  </span>
                            </td>
                            <td className="fw-bold">Q{p.total.toFixed(2)}</td>
                            <td>
                                <button
                                    className="btn btn-sm btn-primary"
                                    onClick={() => setPedidoSeleccionado(p)}
                                >
                                    Ver Detalle
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            ) : (
                <p className="text-muted">No tienes pedidos registrados.</p>
            )}

            {pedidoSeleccionado && (
                <DetallePedidoModal
                    pedido={pedidoSeleccionado}
                    onClose={() => setPedidoSeleccionado(null)}
                />
            )}
        </div>
    );
}
