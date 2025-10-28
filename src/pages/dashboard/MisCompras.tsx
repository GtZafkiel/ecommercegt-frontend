import React, { useEffect, useState } from "react";
import api from "../../services/api";

interface Producto {
    productoId: number;
    nombre: string;
}

interface Detalle {
    detalleId: number;
    cantidad: number;
    precioUnit: number;
    subtotal: number;
    producto: Producto;
}

interface Venta {
    ventaId: number;
    total: number;
    metodoPago: string;
    createdAt: string;
    detalles: Detalle[];
}

export default function MisCompras() {
    const [ventas, setVentas] = useState<Venta[]>([]);
    const [ventaSeleccionada, setVentaSeleccionada] = useState<Venta | null>(null);
    const [showModal, setShowModal] = useState(false);

    const usuario = JSON.parse(localStorage.getItem("user") || "{}");

    useEffect(() => {
        const cargarVentas = async () => {
            try {
                const res = await api.get(`/ventas/usuario/${usuario.usuarioId}`);
                setVentas(Array.isArray(res.data) ? res.data : []);
            } catch (error) {
                console.error("Error al cargar las compras:", error);
            }
        };
        cargarVentas();
    }, [usuario.usuarioId]);

    const formatearFecha = (fechaISO: string) => {
        const fecha = new Date(fechaISO);
        return fecha.toLocaleString("es-GT", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
        });
    };

    const abrirModal = (venta: Venta) => {
        setVentaSeleccionada(venta);
        setShowModal(true);
    };

    const cerrarModal = () => {
        setShowModal(false);
        setVentaSeleccionada(null);
    };

    return (
        <div className="container mt-5">
            <h2 className="mb-4 text-center">Mis Compras</h2>

            {ventas.length === 0 ? (
                <div className="alert alert-info text-center">
                    Aún no has realizado ninguna compra.
                </div>
            ) : (
                <div className="table-responsive shadow-sm">
                    <table className="table table-striped table-bordered table-hover align-middle text-center">
                        <thead className="table-dark">
                        <tr>
                            <th>ID Venta</th>
                            <th>Fecha</th>
                            <th>Total</th>
                            <th>Método de Pago</th>
                            <th>Acción</th>
                        </tr>
                        </thead>
                        <tbody>
                        {ventas.map((v) => (
                            <tr key={v.ventaId}>
                                <td>{v.ventaId}</td>
                                <td>{formatearFecha(v.createdAt)}</td>
                                <td className="text-success fw-bold">Q{v.total.toFixed(2)}</td>
                                <td>{v.metodoPago}</td>
                                <td>
                                    <button
                                        className="btn btn-primary btn-sm"
                                        onClick={() => abrirModal(v)}
                                    >
                                        Ver Detalles
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Modal Bootstrap manual */}
            {showModal && (
                <div
                    className="modal fade show"
                    style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
                    tabIndex={-1}
                    role="dialog"
                >
                    <div className="modal-dialog modal-dialog-centered modal-lg" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Detalles de la Compra</h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={cerrarModal}
                                ></button>
                            </div>

                            <div className="modal-body">
                                {ventaSeleccionada ? (
                                    <>
                                        <p>
                                            <strong>ID Venta:</strong> {ventaSeleccionada.ventaId}
                                        </p>
                                        <p>
                                            <strong>Fecha:</strong>{" "}
                                            {formatearFecha(ventaSeleccionada.createdAt)}
                                        </p>
                                        <p>
                                            <strong>Método de Pago:</strong>{" "}
                                            {ventaSeleccionada.metodoPago}
                                        </p>

                                        <div className="table-responsive">
                                            <table className="table table-striped table-bordered table-sm align-middle text-center">
                                                <thead className="table-secondary">
                                                <tr>
                                                    <th>Producto</th>
                                                    <th>Cantidad</th>
                                                    <th>Precio Unitario</th>
                                                    <th>Subtotal</th>
                                                </tr>
                                                </thead>
                                                <tbody>
                                                {ventaSeleccionada.detalles.map((d) => (
                                                    <tr key={d.detalleId}>
                                                        <td>{d.producto?.nombre || "Sin nombre"}</td>
                                                        <td>{d.cantidad}</td>
                                                        <td>Q{d.precioUnit.toFixed(2)}</td>
                                                        <td>Q{d.subtotal.toFixed(2)}</td>
                                                    </tr>
                                                ))}
                                                </tbody>
                                            </table>
                                        </div>

                                        <div className="text-end fw-bold fs-5 mt-3">
                                            Total:{" "}
                                            <span className="text-success">
                                                Q{ventaSeleccionada.total.toFixed(2)}
                                            </span>
                                        </div>
                                    </>
                                ) : (
                                    <p className="text-center">Cargando detalles...</p>
                                )}
                            </div>

                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={cerrarModal}
                                >
                                    Cerrar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Evita que el scroll se mueva cuando el modal está abierto */}
            {showModal && (
                <div
                    className="modal-backdrop fade show"
                    style={{ zIndex: 1040 }}
                ></div>
            )}
        </div>
    );
}
