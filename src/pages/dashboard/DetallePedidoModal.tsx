import React, { useEffect, useState, useCallback } from "react";
import api from "../../services/api";

interface Producto {
    nombre: string;
}

interface Detalle {
    producto: Producto;
    cantidad: number;
    precioUnit: number;
    subtotal: number;
}

interface Venta {
    ventaId: number;
    metodoPago: string;
    detalles: Detalle[];
}

interface Pedido {
    pedidoId: number;
    fechaEnvio: string;
    fechaEntrega?: string | null;
    estado: string;
    total: number;
    venta?: Venta;
}

interface Props {
    pedido: Pedido;
    onClose: () => void;
}

export default function DetallePedidoModal({ pedido, onClose }: Props) {
    const [detalles, setDetalles] = useState<Detalle[]>([]);
    const [loading, setLoading] = useState(true);

    // Se usa para cargar el detalle del pedido desde el backend
    const cargarDetalle = useCallback(async () => {
        try {
            const res = await api.get(`/pedidos/${pedido.pedidoId}/detalle`);
            setDetalles(res.data.venta.detalles || []);
        } catch {
            setDetalles([]);
        } finally {
            setLoading(false);
        }
    }, [pedido.pedidoId]); // Dependencia agregada correctamente

    useEffect(() => {
        cargarDetalle();
    }, [cargarDetalle]);

    return (
        <div
            className="modal fade show"
            style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
        >
            <div className="modal-dialog modal-lg">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">
                            Detalle del Pedido #{pedido.pedidoId}
                        </h5>
                        <button className="btn-close" onClick={onClose}></button>
                    </div>
                    <div className="modal-body">
                        <p>
                            <strong>Fecha de Envío:</strong>{" "}
                            {new Date(pedido.fechaEnvio).toLocaleDateString()}
                        </p>
                        <p>
                            <strong>Fecha de Entrega:</strong>{" "}
                            {pedido.fechaEntrega
                                ? new Date(pedido.fechaEntrega).toLocaleDateString()
                                : "Pendiente"}
                        </p>
                        <p>
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
                            <div className="text-center">
                                <div className="spinner-border text-primary"></div>
                            </div>
                        ) : detalles.length > 0 ? (
                            <table className="table table-bordered align-middle text-center">
                                <thead className="table-secondary">
                                <tr>
                                    <th>Producto</th>
                                    <th>Cantidad</th>
                                    <th>Precio Unitario</th>
                                    <th>Subtotal</th>
                                </tr>
                                </thead>
                                <tbody>
                                {detalles.map((d, i) => (
                                    <tr key={i}>
                                        <td>{d.producto?.nombre}</td>
                                        <td>{d.cantidad}</td>
                                        <td>Q{d.precioUnit.toFixed(2)}</td>
                                        <td>Q{d.subtotal.toFixed(2)}</td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        ) : (
                            <p className="text-muted">No hay productos en este pedido.</p>
                        )}

                        <div className="text-end mt-3">
                            <strong>Total:</strong>{" "}
                            <span className="fw-bold">Q{pedido.total.toFixed(2)}</span>
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
