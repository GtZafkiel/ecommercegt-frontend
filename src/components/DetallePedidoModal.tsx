import React, { useEffect, useState } from "react";
import api from "../services/api";

interface Detalle {
    detalleId: number;
    producto: {
        nombre: string;
        imagenUrl?: string;
        precio: number;
    };
    cantidad: number;
    precio: number;
    subtotal: number;
}

interface Pedido {
    pedidoId: number;
    fechaEnvio: string;
    fechaEntrega?: string;
    estado: string;
    total: number;
}

interface Props {
    pedido: Pedido | null;
    onClose: () => void;
}

export default function DetallePedidoModal({ pedido, onClose }: Props) {
    const [detalles, setDetalles] = useState<Detalle[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (pedido) cargarDetalles(pedido.pedidoId);
    }, [pedido]);

    async function cargarDetalles(pedidoId: number) {
        setLoading(true);
        try {
            const res = await api.get(`/pedidos/${pedidoId}/detalles`);
            setDetalles(res.data);
        } catch (err) {
            console.error("Error al cargar los detalles del pedido:", err);
        } finally {
            setLoading(false);
        }
    }

    if (!pedido) return null;

    return (
        <div
            className="modal fade show d-block"
            tabIndex={-1}
            style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
        >
            <div className="modal-dialog modal-lg modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header bg-dark text-white">
                        <h5 className="modal-title">Detalle del Pedido #{pedido.pedidoId}</h5>
                        <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
                    </div>
                    <div className="modal-body">
                        <p>
                            <strong>Fecha de Envío:</strong>{" "}
                            {new Date(pedido.fechaEnvio).toLocaleDateString()}
                            <br />
                            <strong>Fecha de Entrega:</strong>{" "}
                            {pedido.fechaEntrega
                                ? new Date(pedido.fechaEntrega).toLocaleDateString()
                                : "Pendiente"}
                            <br />
                            <strong>Estado:</strong>{" "}
                            <span
                                className={`badge ${
                                    pedido.estado === "ENTREGADO"
                                        ? "bg-success"
                                        : "bg-warning text-dark"
                                }`}
                            >
                {pedido.estado}
              </span>
                        </p>

                        {loading ? (
                            <div className="text-center py-4">
                                <div className="spinner-border text-primary"></div>
                            </div>
                        ) : detalles.length > 0 ? (
                            <table className="table table-bordered align-middle">
                                <thead className="table-dark text-center">
                                <tr>
                                    <th>Producto</th>
                                    <th>Cantidad</th>
                                    <th>Precio (Q)</th>
                                    <th>Subtotal (Q)</th>
                                </tr>
                                </thead>
                                <tbody>
                                {detalles.map((d) => (
                                    <tr key={d.detalleId}>
                                        <td>
                                            {d.producto.imagenUrl && (
                                                <img
                                                    src={d.producto.imagenUrl}
                                                    alt={d.producto.nombre}
                                                    className="me-2 rounded"
                                                    style={{ width: "40px", height: "40px", objectFit: "cover" }}
                                                />
                                            )}
                                            {d.producto.nombre}
                                        </td>
                                        <td className="text-center">{d.cantidad}</td>
                                        <td className="text-end">Q{d.precio.toFixed(2)}</td>
                                        <td className="text-end fw-bold">Q{d.subtotal.toFixed(2)}</td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        ) : (
                            <p className="text-muted">No hay productos en este pedido.</p>
                        )}

                        <div className="text-end mt-3">
                            <h5 className="fw-bold">Total: Q{pedido.total.toFixed(2)}</h5>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button className="btn btn-secondary" onClick={onClose}>
                            Cerrar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
