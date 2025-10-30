import React, { useEffect, useState, useCallback } from "react";
import api from "../../services/api";

export default function Carrito() {
    const [carrito, setCarrito] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    // Se usa para cargar el carrito del usuario
    const cargarCarrito = useCallback(async () => {
        setLoading(true);
        try {
            const res = await api.get(`/carrito/${user.usuarioId}`);
            setCarrito(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [user.usuarioId]); // dependencia agregada correctamente

    const eliminarItem = async (id: number) => {
        if (!window.confirm("¿Eliminar este producto del carrito?")) return;
        await api.delete(`/carrito/item/${id}`);
        cargarCarrito();
    };

    const vaciarCarrito = async () => {
        if (!window.confirm("¿Vaciar todo el carrito?")) return;
        await api.delete(`/carrito/${user.usuarioId}/vaciar`);
        cargarCarrito();
    };

    useEffect(() => {
        cargarCarrito();
    }, [cargarCarrito]);

    if (loading) {
        return (
            <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status"></div>
                <p className="mt-3">Cargando carrito...</p>
            </div>
        );
    }

    return (
        <div className="container mt-4">
            <h2 className="mb-4">Mi Carrito</h2>

            {!carrito || !carrito.items || carrito.items.length === 0 ? (
                <div className="alert alert-info">Tu carrito está vacío.</div>
            ) : (
                <>
                    <table className="table table-hover table-bordered align-middle">
                        <thead className="table-dark text-center">
                        <tr>
                            <th>Producto</th>
                            <th>Cantidad</th>
                            <th>Precio Unitario</th>
                            <th>Subtotal</th>
                            <th>Acciones</th>
                        </tr>
                        </thead>
                        <tbody>
                        {carrito.items.map((item: any) => (
                            <tr key={item.itemId}>
                                <td>{item.producto.nombre}</td>
                                <td className="text-center">{item.cantidad}</td>
                                <td className="text-end">
                                    Q{item.producto.precio.toFixed(2)}
                                </td>
                                <td className="text-end">
                                    Q{item.subtotal.toFixed(2)}
                                </td>
                                <td className="text-center">
                                    <button
                                        className="btn btn-sm btn-outline-danger"
                                        onClick={() => eliminarItem(item.itemId)}
                                    >
                                        Eliminar
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>

                    <div className="d-flex justify-content-between align-items-center mt-3">
                        <button
                            className="btn btn-outline-secondary"
                            onClick={vaciarCarrito}
                        >
                            Vaciar Carrito
                        </button>
                        <h4 className="fw-bold">
                            Total: Q{carrito.total.toFixed(2)}
                        </h4>
                    </div>

                    <div className="text-end mt-3">
                        <button className="btn btn-success">
                            Pagar Carrito (Simulado)
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}
