import React, { useEffect, useState } from "react";
import api from "../../services/api";

interface Producto {
    productoId: number;
    nombre: string;
    descripcion: string;
    imagen: string;
    precio: number;
    usuario: { username: string; email: string };
}

export default function SolicitudesProductos() {
    const [productos, setProductos] = useState<Producto[]>([]);
    const [loading, setLoading] = useState(false);
    const [mensaje, setMensaje] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [motivo, setMotivo] = useState<string>("");

    // Se usa para cargar los productos pendientes de aprobación
    const cargarProductos = async () => {
        setLoading(true);
        try {
            const res = await api.get("/productos/pendientes");
            setProductos(res.data);
        } catch (err) {
            setError("Error al cargar solicitudes.");
        } finally {
            setLoading(false);
        }
    };

    // Se usa para aprobar un producto
    const aprobarProducto = async (id: number) => {
        try {
            await api.put(`/productos/${id}/aprobar`);
            setMensaje("Producto aprobado correctamente.");
            cargarProductos();
        } catch {
            setError("Error al aprobar producto.");
        }
    };

    // Se usa para rechazar un producto
    const rechazarProducto = async (id: number) => {
        if (!motivo.trim()) {
            alert("Debes ingresar un motivo de rechazo.");
            return;
        }
        try {
            await api.put(`/productos/${id}/rechazar`, { motivo });
            setMensaje("Producto rechazado correctamente.");
            setMotivo("");
            cargarProductos();
        } catch {
            setError("Error al rechazar producto.");
        }
    };

    useEffect(() => {
        cargarProductos();
    }, []);

    return (
        <div className="container mt-4">
            <h3 className="mb-4 text-center">Solicitudes de Ingreso de Productos</h3>

            {loading && <div className="alert alert-info">Cargando solicitudes...</div>}
            {mensaje && <div className="alert alert-success">{mensaje}</div>}
            {error && <div className="alert alert-danger">{error}</div>}

            <div className="row">
                {productos.map((p) => (
                    <div key={p.productoId} className="col-md-4 mb-4">
                        <div className="card shadow-sm">
                            <img
                                src={p.imagen}
                                className="card-img-top"
                                alt={p.nombre}
                                style={{ height: "200px", objectFit: "cover" }}
                            />
                            <div className="card-body">
                                <h5 className="card-title">{p.nombre}</h5>
                                <p className="card-text">{p.descripcion}</p>
                                <p className="text-muted">Vendedor: {p.usuario.username}</p>
                                <p><strong>Precio:</strong> Q{p.precio}</p>

                                <div className="mb-2">
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Motivo de rechazo"
                                        value={motivo}
                                        onChange={(e) => setMotivo(e.target.value)}
                                    />
                                </div>

                                <div className="d-flex justify-content-between">
                                    <button
                                        className="btn btn-success btn-sm"
                                        onClick={() => aprobarProducto(p.productoId)}
                                    >
                                        Aprobar
                                    </button>
                                    <button
                                        className="btn btn-danger btn-sm"
                                        onClick={() => rechazarProducto(p.productoId)}
                                    >
                                        Rechazar
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
