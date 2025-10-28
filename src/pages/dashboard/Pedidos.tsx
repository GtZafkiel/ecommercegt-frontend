import React, { useEffect, useState } from "react";
import api from "../../services/api";

export default function Pedidos() {
    const [pedidos, setPedidos] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    const cargarPedidos = async () => {
        setLoading(true);
        try {
            const res = await api.get(`/pedidos/usuario/${user.usuarioId}`);
            setPedidos(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        cargarPedidos();
    }, []);

    return (
        <div className="container mt-4">
            <h2 className="mb-4">Mis Pedidos</h2>

            {loading ? (
                <div className="text-center py-5">
                    <div className="spinner-border text-primary" role="status"></div>
                    <p className="mt-3">Cargando pedidos...</p>
                </div>
            ) : pedidos.length > 0 ? (
                <table className="table table-hover table-bordered align-middle">
                    <thead className="table-dark text-center">
                    <tr>
                        <th>ID</th>
                        <th>Fecha</th>
                        <th>Total (Q)</th>
                        <th>Estado</th>
                    </tr>
                    </thead>
                    <tbody>
                    {pedidos.map((p) => (
                        <tr key={p.pedidoId}>
                            <td className="text-center">{p.pedidoId}</td>
                            <td>{new Date(p.fecha).toLocaleString()}</td>
                            <td className="text-end">Q{p.total.toFixed(2)}</td>
                            <td className="text-center">
                  <span
                      className={`badge ${
                          p.estado === "ENTREGADO"
                              ? "bg-success"
                              : "bg-warning text-dark"
                      }`}
                  >
                    {p.estado}
                  </span>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            ) : (
                <div className="alert alert-info">Aún no tienes pedidos realizados.</div>
            )}
        </div>
    );
}
