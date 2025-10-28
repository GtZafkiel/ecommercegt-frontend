import React, { useEffect, useState } from "react";
import api from "../../services/api";

interface Pedido {
    pedidoId: number;
    fechaEnvio: string;
    fechaEntrega: string | null;
    estado: string;
    venta: {
        ventaId: number;
        total: number;
        usuario: {
            username: string;
        };
    };
}

export default function PedidosLogistica() {
    const [pedidos, setPedidos] = useState<Pedido[]>([]);
    const [loading, setLoading] = useState(false);
    const [mensaje, setMensaje] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const [pedidoSeleccionado, setPedidoSeleccionado] = useState<Pedido | null>(null);
    const [nuevaFecha, setNuevaFecha] = useState<string>("");

    // ============================================================
    // Se usa para cargar todos los pedidos en curso
    // ============================================================
    const cargarPedidos = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await api.get("/pedidos/en-curso");
            setPedidos(res.data);
        } catch {
            setError("No se pudieron cargar los pedidos.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        cargarPedidos();
    }, []);

    // ============================================================
    // Se usa para actualizar la fecha de entrega del pedido
    // ============================================================
    const actualizarFecha = async () => {
        if (!pedidoSeleccionado || !nuevaFecha) return;
        try {
            await api.put(`/pedidos/${pedidoSeleccionado.pedidoId}/fecha`, {
                fecha_entrega: nuevaFecha,
            });
            setMensaje("Fecha de entrega actualizada correctamente.");
            setPedidoSeleccionado(null);
            setNuevaFecha("");
            cargarPedidos();
        } catch {
            setError("Error al actualizar la fecha de entrega.");
        }
    };

    // ============================================================
    // Se usa para marcar el pedido como entregado
    // ============================================================
    const marcarEntregado = async (pedidoId: number) => {
        try {
            await api.put(`/pedidos/${pedidoId}/estado?estado=ENTREGADO`);
            setMensaje("Pedido marcado como entregado.");
            cargarPedidos();
        } catch {
            setError("Error al actualizar el estado del pedido.");
        }
    };

    return (
        <div className="container py-4">
            <h2 className="mb-4">Seguimiento de Pedidos</h2>

            {mensaje && <div className="alert alert-success">{mensaje}</div>}
            {error && <div className="alert alert-danger">{error}</div>}

            {loading ? (
                <div className="text-center py-5">
                    <div className="spinner-border text-primary" role="status"></div>
                </div>
            ) : (
                <div className="table-responsive">
                    <table className="table table-striped align-middle text-center">
                        <thead className="table-dark">
                        <tr>
                            <th>ID Pedido</th>
                            <th>Cliente</th>
                            <th>Total (Q)</th>
                            <th>Fecha Envío</th>
                            <th>Fecha Entrega</th>
                            <th>Estado</th>
                            <th>Acciones</th>
                        </tr>
                        </thead>
                        <tbody>
                        {pedidos.length === 0 ? (
                            <tr>
                                <td colSpan={7}>No hay pedidos en curso</td>
                            </tr>
                        ) : (
                            pedidos.map((p) => (
                                <tr key={p.pedidoId}>
                                    <td>{p.pedidoId}</td>
                                    <td>{p.venta.usuario.username}</td>
                                    <td>{p.venta.total.toFixed(2)}</td>
                                    <td>{p.fechaEnvio}</td>
                                    <td>{p.fechaEntrega || "Sin definir"}</td>
                                    <td>
                      <span
                          className={`badge ${
                              p.estado === "EN_CURSO"
                                  ? "bg-warning text-dark"
                                  : "bg-success"
                          }`}
                      >
                        {p.estado}
                      </span>
                                    </td>
                                    <td>
                                        <button
                                            className="btn btn-sm btn-outline-primary me-2"
                                            onClick={() => setPedidoSeleccionado(p)}
                                        >
                                            Cambiar Fecha
                                        </button>
                                        <button
                                            className="btn btn-sm btn-success"
                                            onClick={() => marcarEntregado(p.pedidoId)}
                                        >
                                            Marcar Entregado
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Modal para actualizar fecha */}
            {pedidoSeleccionado && (
                <div
                    className="modal fade show"
                    style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
                >
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">
                                    Actualizar Fecha de Entrega - Pedido #{pedidoSeleccionado.pedidoId}
                                </h5>
                                <button
                                    className="btn-close"
                                    onClick={() => setPedidoSeleccionado(null)}
                                ></button>
                            </div>
                            <div className="modal-body">
                                <div className="mb-3">
                                    <label className="form-label">Nueva Fecha de Entrega</label>
                                    <input
                                        type="date"
                                        className="form-control"
                                        value={nuevaFecha}
                                        onChange={(e) => setNuevaFecha(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button
                                    className="btn btn-secondary"
                                    onClick={() => setPedidoSeleccionado(null)}
                                >
                                    Cancelar
                                </button>
                                <button className="btn btn-primary" onClick={actualizarFecha}>
                                    Guardar Cambios
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
