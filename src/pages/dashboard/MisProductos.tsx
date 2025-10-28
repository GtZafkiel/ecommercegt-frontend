import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BotonAgregarCarrito from "../../components/BotonAgregarCarrito";
import { getProductosByUser, eliminarProducto } from "../../services/api";

export default function MisProductos() {
    const navigate = useNavigate();
    const [productos, setProductos] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [mensaje, setMensaje] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const user = JSON.parse(localStorage.getItem("user") || "{}");

    // Se usa para cargar los productos del usuario
    const cargarProductos = async () => {
        if (!user?.usuarioId) return;
        setLoading(true);
        setError(null);

        try {
            const res = await getProductosByUser(user.usuarioId);
            setProductos(res.data);
        } catch (err) {
            console.error(err);
            setError("Error al cargar los productos.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        cargarProductos();
    }, []);

    const handleEliminar = async (id: number) => {
        if (!window.confirm("¿Seguro que deseas eliminar este producto?")) return;

        try {
            await eliminarProducto(id);
            setMensaje("Producto eliminado correctamente.");
            cargarProductos();
            setTimeout(() => setMensaje(null), 2500);
        } catch (err) {
            console.error(err);
            setError("No se pudo eliminar el producto.");
            setTimeout(() => setError(null), 2500);
        }
    };

    const handleEditar = (productoId: number) => {
        navigate(`/dashboard/mis-productos/editar/${productoId}`);
    };

    const handleNuevo = () => {
        navigate("/dashboard/mis-productos/nuevo");
    };

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Mis Productos</h2>
                <button className="btn btn-primary" onClick={handleNuevo}>
                    + Nuevo Producto
                </button>
            </div>

            {mensaje && <div className="alert alert-success">{mensaje}</div>}
            {error && <div className="alert alert-danger">{error}</div>}

            {loading ? (
                <div className="text-center py-5">
                    <div className="spinner-border text-primary" role="status"></div>
                    <p className="mt-3">Cargando productos...</p>
                </div>
            ) : (
                <div className="table-responsive">
                    <table className="table table-hover table-bordered align-middle">
                        <thead className="table-dark text-center">
                        <tr>
                            <th>ID</th>
                            <th>Nombre</th>
                            <th>Categoría</th>
                            <th>Precio (Q)</th>
                            <th>Stock</th>
                            <th>Estado</th>
                            <th>Revisión</th>
                            <th>Acciones</th>
                        </tr>
                        </thead>
                        <tbody>
                        {productos.length > 0 ? (
                            productos.map((p) => (
                                <tr key={p.productoId}>
                                    <td className="text-center">{p.productoId}</td>
                                    <td>{p.nombre}</td>
                                    <td>{p.categoria?.name || "Sin categoría"}</td>
                                    <td className="text-end">Q{p.precio?.toFixed(2)}</td>
                                    <td className="text-center">{p.stock}</td>
                                    <td className="text-center">{p.estado}</td>
                                    <td className="text-center">
                      <span
                          className={`badge ${
                              p.estadoRevision === "APROBADO"
                                  ? "bg-success"
                                  : p.estadoRevision === "RECHAZADO"
                                      ? "bg-danger"
                                      : "bg-warning text-dark"
                          }`}
                      >
                        {p.estadoRevision}
                      </span>
                                    </td>
                                    <td className="text-center">
                                        <div className="d-flex flex-column gap-2 align-items-center">
                                            {p.estadoRevision === "APROBADO" && (
                                                <BotonAgregarCarrito
                                                    usuarioId={user.usuarioId}
                                                    productoId={p.productoId}
                                                    stock={p.stock}
                                                />
                                            )}
                                            <div>
                                                <button
                                                    className="btn btn-sm btn-outline-primary me-2"
                                                    onClick={() => handleEditar(p.productoId)}
                                                >
                                                    Editar
                                                </button>
                                                <button
                                                    className="btn btn-sm btn-outline-danger"
                                                    onClick={() => handleEliminar(p.productoId)}
                                                >
                                                    Eliminar
                                                </button>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={8} className="text-center">
                                    No tienes productos registrados.
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
