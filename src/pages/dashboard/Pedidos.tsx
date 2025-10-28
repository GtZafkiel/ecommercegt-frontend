import React, { useEffect, useState } from "react";
import api from "../../services/api";
import DetallePedidoModal from "./DetallePedidoModal";

interface Pedido {
    pedidoId: number;
    fechaEnvio: string;
    fechaEntrega?: string;
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
            const res = await api.get(`/pedidos/usuario/${user.usuarioId}`);
            setPedidos(res.data);
        } catch (err) {
            console.error("Error al cargar los pedidos:", err);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="container mt-4">
            <h3 className="mb-3">Mis Pedidos</h3>

            {loading ? (
                <div className="text-center py-4">
                    <div className="spinner-border text-primary"></div>
                </div>
            ) : pedidos.length > 0 ? (
                <table className="table table-striped table-hover align-middle">
                    <thead className="table-dark text-center">
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
                            <td className="text-center">{p.pedidoId}</td>
                            <td>{new Date(p.fechaEnvio).toLocaleDateString()}</td>
                            <td>
                                {p.fechaEntrega
                                    ? new Date(p.fechaEntrega).toLocaleDateString()
                                    : "Pendiente"}
                            </td>
                            <td className="text-center">
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
                            <td className="text-end fw-bold">Q{p.total.toFixed(2)}</td>
                            <td className="text-center">
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
