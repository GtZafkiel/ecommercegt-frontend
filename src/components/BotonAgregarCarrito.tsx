import React, { useState } from "react";
import { agregarAlCarrito } from "../services/api";

interface Props {
    usuarioId: number;
    productoId: number;
    stock: number;
}

export default function BotonAgregarCarrito({ usuarioId, productoId, stock }: Props) {
    const [cantidad, setCantidad] = useState(1);
    const [mensaje, setMensaje] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleAgregar = async () => {
        if (cantidad <= 0 || cantidad > stock) {
            setError("Cantidad no válida o supera el stock.");
            setTimeout(() => setError(null), 2500);
            return;
        }
        setLoading(true);
        try {
            await agregarAlCarrito(usuarioId, productoId, cantidad);
            setMensaje("Producto agregado al carrito.");
            setTimeout(() => setMensaje(null), 2000);
        } catch (err: any) {
            console.error(err);
            setError("Error al agregar el producto al carrito.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <div className="input-group mb-2" style={{ maxWidth: "180px" }}>
                <input
                    type="number"
                    min="1"
                    max={stock}
                    className="form-control text-center"
                    value={cantidad}
                    onChange={(e) => setCantidad(parseInt(e.target.value))}
                />
                <button
                    className="btn btn-success"
                    onClick={handleAgregar}
                    disabled={loading}
                >
                    {loading ? "Agregando..." : "Agregar"}
                </button>
            </div>

            {mensaje && <div className="text-success small">{mensaje}</div>}
            {error && <div className="text-danger small">{error}</div>}
        </div>
    );
}
