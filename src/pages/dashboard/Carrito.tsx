import React, { useEffect, useState } from "react";
import api from "../../services/api";

interface Tarjeta {
    tarjetaId: number;
    numero: string;
    nombreTitular: string;
    expiracion: string;
    tipo: string;
}

export default function Carrito() {
    const [carrito, setCarrito] = useState<any>(null);
    const [tarjetas, setTarjetas] = useState<Tarjeta[]>([]);
    const [metodoPago, setMetodoPago] = useState<string>("TARJETA");
    const [tarjetaSeleccionada, setTarjetaSeleccionada] = useState<number | "nueva" | null>(null);
    const [nuevaTarjeta, setNuevaTarjeta] = useState({
        numero: "",
        nombreTitular: "",
        expiracion: "",
        cvv: "",
        tipo: "VISA",
    });

    const [mensaje, setMensaje] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    // ============================
    // Se usa para cargar carrito y tarjetas guardadas del usuario
    // ============================
    const cargarDatos = async () => {
        setLoading(true);
        try {
            const [carritoRes, tarjetasRes] = await Promise.all([
                api.get(`/carrito/${user.usuarioId}`),
                api.get(`/tarjetas/usuario/${user.usuarioId}`)
            ]);
            setCarrito(carritoRes.data);
            setTarjetas(tarjetasRes.data);
        } catch (err) {
            console.error(err);
            setError("Error al cargar carrito o tarjetas");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        cargarDatos();
    }, []);

    // ============================
    // Se usa para eliminar un producto específico del carrito
    // ============================
    const eliminarProducto = async (itemId: number) => {
        try {
            await api.delete(`/carrito/item/${itemId}`);
            setMensaje("Producto eliminado del carrito correctamente");
            cargarDatos();
        } catch (err) {
            console.error(err);
            setError("Error al eliminar el producto del carrito");
        }
    };

    // ============================
    // Se usa para vaciar completamente el carrito
    // ============================
    const vaciarCarrito = async () => {
        if (!window.confirm("¿Seguro que deseas vaciar el carrito?")) return;
        try {
            await api.delete(`/carrito/${user.usuarioId}/vaciar`);
            setMensaje("Carrito vaciado correctamente");
            setCarrito({ items: [], total: 0 });
        } catch (err) {
            console.error(err);
            setError("Error al vaciar carrito");
        }
    };

    // ============================
    // Se usa para registrar una nueva tarjeta
    // ============================
    const guardarTarjeta = async () => {
        if (!nuevaTarjeta.numero || !nuevaTarjeta.nombreTitular || !nuevaTarjeta.expiracion || !nuevaTarjeta.cvv) {
            setError("Por favor llena todos los campos de la nueva tarjeta");
            return;
        }
        if (nuevaTarjeta.numero.length < 13 || nuevaTarjeta.numero.length > 16) {
            setError("El número de tarjeta debe tener entre 13 y 16 dígitos.");
            return;
        }

        try {
            await api.post(`/tarjetas`, { ...nuevaTarjeta, usuario: { usuarioId: user.usuarioId } });
            setMensaje("Tarjeta guardada correctamente");
            setNuevaTarjeta({ numero: "", nombreTitular: "", expiracion: "", cvv: "", tipo: "VISA" });
            cargarDatos();
        } catch {
            setError("No se pudo guardar la tarjeta");
        }
    };

    // ============================
    // Se usa para procesar el pago del carrito
    // ============================
    const procesarPago = async () => {
        if (!carrito || !carrito.items || carrito.items.length === 0) {
            setError("No puedes pagar un carrito vacío");
            return;
        }
        if (metodoPago === "TARJETA" && tarjetaSeleccionada === null) {
            setError("Selecciona o agrega una tarjeta para continuar");
            return;
        }

        const confirmar = window.confirm("¿Confirmar el pago del carrito?");
        if (!confirmar) return;

        try {
            setLoading(true);
            const payload: any = { metodoPago };

            if (metodoPago === "TARJETA") {
                if (tarjetaSeleccionada === "nueva") {
                    payload.tarjeta = nuevaTarjeta;
                } else {
                    payload.tarjetaId = tarjetaSeleccionada;
                }
            }

            const res = await api.post(`/ventas/pagar/${user.usuarioId}`, payload);
            setMensaje(res.data.mensaje || "Venta registrada correctamente");

            await api.delete(`/carrito/${user.usuarioId}/vaciar`);
            setCarrito({ items: [], total: 0 });

            setTimeout(() => {
                window.location.href = "/dashboard/mis-compras";
            }, 2000);
        } catch (err) {
            console.error(err);
            setError("Error al procesar el pago");
        } finally {
            setLoading(false);
        }
    };

    // ============================
    // RENDERIZADO PRINCIPAL
    // ============================
    return (
        <div className="container mt-4">
            <h2 className="mb-4">Mi Carrito</h2>

            {mensaje && <div className="alert alert-success">{mensaje}</div>}
            {error && <div className="alert alert-danger">{error}</div>}

            {!carrito || !carrito.items || carrito.items.length === 0 ? (
                <div className="alert alert-info">Tu carrito está vacío.</div>
            ) : (
                <>
                    {/* TABLA DEL CARRITO */}
                    <table className="table table-striped table-bordered align-middle">
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
                                <td className="text-end">Q{item.producto.precio.toFixed(2)}</td>
                                <td className="text-end">Q{item.subtotal.toFixed(2)}</td>
                                <td className="text-center">
                                    <button
                                        className="btn btn-outline-danger btn-sm"
                                        onClick={() => eliminarProducto(item.itemId)}
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
                            className="btn btn-danger"
                            onClick={vaciarCarrito}
                            disabled={!carrito || carrito.items.length === 0}
                        >
                            Vaciar Carrito
                        </button>
                        <div className="fw-bold fs-5">
                            Total: Q{carrito.total.toFixed(2)}
                        </div>
                    </div>

                    {/* SECCIÓN MÉTODO DE PAGO */}
                    <div className="card mt-4 shadow-sm">
                        <div className="card-body">
                            <h5>Método de Pago</h5>
                            <select
                                className="form-select mb-3"
                                value={metodoPago}
                                onChange={(e) => setMetodoPago(e.target.value)}
                            >
                                <option value="TARJETA">TARJETA</option>
                                <option value="EFECTIVO">EFECTIVO</option>
                            </select>

                            {metodoPago === "TARJETA" && (
                                <>
                                    <label className="form-label">Selecciona una tarjeta</label>
                                    <select
                                        className="form-select mb-3"
                                        value={tarjetaSeleccionada ?? ""}
                                        onChange={(e) =>
                                            setTarjetaSeleccionada(
                                                e.target.value === "nueva"
                                                    ? "nueva"
                                                    : Number(e.target.value)
                                            )
                                        }
                                    >
                                        <option value="">-- Selecciona --</option>
                                        {tarjetas.map((t) => (
                                            <option key={t.tarjetaId} value={t.tarjetaId}>
                                                {t.tipo} •••• {t.numero.slice(-4)} ({t.nombreTitular})
                                            </option>
                                        ))}
                                        <option value="nueva">+ Agregar nueva tarjeta</option>
                                    </select>

                                    {tarjetaSeleccionada === "nueva" && (
                                        <div className="border rounded p-3 bg-light">
                                            <div className="row g-3">
                                                <div className="col-md-6">
                                                    <label>Número de Tarjeta</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        maxLength={16}
                                                        minLength={13}
                                                        placeholder="Solo números"
                                                        value={nuevaTarjeta.numero}
                                                        onChange={(e) => {
                                                            const value = e.target.value.replace(/\D/g, "");
                                                            setNuevaTarjeta({ ...nuevaTarjeta, numero: value });
                                                        }}
                                                    />
                                                </div>
                                                <div className="col-md-6">
                                                    <label>Nombre del Titular</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        value={nuevaTarjeta.nombreTitular}
                                                        onChange={(e) =>
                                                            setNuevaTarjeta({ ...nuevaTarjeta, nombreTitular: e.target.value })
                                                        }
                                                    />
                                                </div>
                                                <div className="col-md-4">
                                                    <label>Expiración (MM/AA)</label>
                                                    <input
                                                        type="text"
                                                        maxLength={5}
                                                        className="form-control"
                                                        placeholder="09/27"
                                                        value={nuevaTarjeta.expiracion}
                                                        onChange={(e) =>
                                                            setNuevaTarjeta({ ...nuevaTarjeta, expiracion: e.target.value })
                                                        }
                                                    />
                                                </div>
                                                <div className="col-md-4">
                                                    <label>CVV</label>
                                                    <input
                                                        type="password"
                                                        maxLength={3}
                                                        className="form-control"
                                                        value={nuevaTarjeta.cvv}
                                                        onChange={(e) =>
                                                            setNuevaTarjeta({ ...nuevaTarjeta, cvv: e.target.value })
                                                        }
                                                    />
                                                </div>
                                                <div className="col-md-4">
                                                    <label>Tipo</label>
                                                    <select
                                                        className="form-select"
                                                        value={nuevaTarjeta.tipo}
                                                        onChange={(e) =>
                                                            setNuevaTarjeta({ ...nuevaTarjeta, tipo: e.target.value })
                                                        }
                                                    >
                                                        <option value="VISA">VISA</option>
                                                        <option value="MASTERCARD">MASTERCARD</option>
                                                        <option value="AMERICAN EXPRESS">AMERICAN EXPRESS</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="text-end mt-3">
                                                <button className="btn btn-primary btn-sm" onClick={guardarTarjeta}>
                                                    Guardar Tarjeta
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </div>

                    <div className="text-end mt-4">
                        <button className="btn btn-success" onClick={procesarPago} disabled={loading}>
                            {loading ? "Procesando..." : "Pagar Carrito"}
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}
