import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

export default function Tienda() {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const [productos, setProductos] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [mensaje, setMensaje] = useState<string | null>(null);
    const navigate = useNavigate();

    // Se usa para cargar los productos disponibles
    const cargarProductos = useCallback(async () => {
        if (!user?.usuarioId) return;
        setLoading(true);
        setError(null);
        try {
            const res = await api.get(`/tienda/disponibles/${user.usuarioId}`);
            setProductos(res.data);
        } catch {
            setError("Error al cargar los productos disponibles.");
        } finally {
            setLoading(false);
        }
    }, [user?.usuarioId]); // dependencia agregada correctamente

    useEffect(() => {
        cargarProductos();
    }, [cargarProductos]);

    const agregarAlCarrito = async (productoId: number, cantidad: number) => {
        try {
            await api.post(`/carrito/${user.usuarioId}/agregar`, null, {
                params: { productoId, cantidad },
            });
            setMensaje("Producto agregado al carrito.");
            setTimeout(() => setMensaje(null), 2000);
        } catch {
            setError("Error al agregar el producto al carrito.");
            setTimeout(() => setError(null), 2000);
        }
    };

    const verDetalle = (productoId: number) => {
        navigate(`/dashboard/producto/${productoId}`);
    };

    return (
        <div className="container mt-4">
            <h2 className="mb-4">Productos Disponibles</h2>

            {mensaje && <div className="alert alert-success">{mensaje}</div>}
            {error && <div className="alert alert-danger">{error}</div>}

            {loading ? (
                <div className="text-center py-5">
                    <div className="spinner-border text-primary" role="status"></div>
                </div>
            ) : productos.length > 0 ? (
                <table className="table table-hover table-bordered align-middle">
                    <thead className="table-dark text-center">
                    <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Categoría</th>
                        <th>Precio (Q)</th>
                        <th>Stock</th>
                        <th>Acciones</th>
                    </tr>
                    </thead>
                    <tbody>
                    {productos.map((p) => (
                        <tr key={p.productoId}>
                            <td className="text-center">{p.productoId}</td>
                            <td>{p.nombre}</td>
                            <td>{p.categoria?.nombre || "Sin categoría"}</td>
                            <td className="text-end">Q{p.precio.toFixed(2)}</td>
                            <td className="text-center">{p.stock}</td>
                            <td className="text-center">
                                <div className="d-flex justify-content-center align-items-center gap-2">
                                    <input
                                        type="number"
                                        min={1}
                                        max={p.stock}
                                        defaultValue={1}
                                        className="form-control form-control-sm text-center"
                                        style={{ width: "70px" }}
                                        id={`cantidad-${p.productoId}`}
                                    />
                                    <button
                                        className="btn btn-success btn-sm"
                                        onClick={() => {
                                            const cantidad = parseInt(
                                                (
                                                    document.getElementById(
                                                        `cantidad-${p.productoId}`
                                                    ) as HTMLInputElement
                                                ).value
                                            );
                                            agregarAlCarrito(p.productoId, cantidad);
                                        }}
                                    >
                                        Agregar
                                    </button>
                                    <button
                                        className="btn btn-primary btn-sm"
                                        onClick={() => verDetalle(p.productoId)}
                                    >
                                        Ver Detalle
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            ) : (
                <div className="alert alert-info">No hay productos disponibles.</div>
            )}
        </div>
    );
}
