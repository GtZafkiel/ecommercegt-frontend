import React, { useState } from "react";
import api from "../../services/api";

export default function AdminReportes() {
    const [tipoReporte, setTipoReporte] = useState<string>("");
    const [fechaInicio, setFechaInicio] = useState<string>("");
    const [fechaFin, setFechaFin] = useState<string>("");
    const [data, setData] = useState<Record<string, any>[]>([]);
    const [mensaje, setMensaje] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const obtenerReporte = async () => {
        if (!tipoReporte) {
            setMensaje("Seleccione un tipo de reporte.");
            return;
        }
        setLoading(true);
        setMensaje(null);

        try {
            const res = await api.get(`/reportes/${tipoReporte}`, {
                params: { fechaInicio, fechaFin },
            });
            setData(res.data);
        } catch (error) {
            setMensaje("Error al generar el reporte.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mt-4">
            <h3 className="text-center mb-4">Reportes del Administrador</h3>

            <div className="card p-4 shadow-sm">
                <div className="row mb-3">
                    <div className="col-md-4">
                        <label className="form-label fw-bold">Tipo de Reporte</label>
                        <select
                            className="form-select"
                            value={tipoReporte}
                            onChange={(e) => setTipoReporte(e.target.value)}
                        >
                            <option value="">Seleccione...</option>
                            <option value="productos-vendidos">Top 10 productos más vendidos</option>
                            <option value="clientes-ganancias">Top 5 clientes con más ganancias</option>
                            <option value="clientes-vendedores">Top 5 clientes que más han vendido</option>
                            <option value="clientes-pedidos">Top 10 clientes con más pedidos</option>
                            <option value="clientes-productos">Top 10 clientes con más productos en venta</option>
                            <option value="sanciones">Historial de sanciones</option>
                            <option value="notificaciones">Historial de notificaciones</option>
                        </select>
                    </div>

                    {tipoReporte !== "sanciones" && tipoReporte !== "notificaciones" && (
                        <>
                            <div className="col-md-3">
                                <label className="form-label fw-bold">Fecha inicio</label>
                                <input
                                    type="date"
                                    className="form-control"
                                    value={fechaInicio}
                                    onChange={(e) => setFechaInicio(e.target.value)}
                                />
                            </div>
                            <div className="col-md-3">
                                <label className="form-label fw-bold">Fecha fin</label>
                                <input
                                    type="date"
                                    className="form-control"
                                    value={fechaFin}
                                    onChange={(e) => setFechaFin(e.target.value)}
                                />
                            </div>
                        </>
                    )}

                    <div className="col-md-2 d-flex align-items-end">
                        <button
                            onClick={obtenerReporte}
                            className="btn btn-success w-100"
                            disabled={loading}
                        >
                            {loading ? "Cargando..." : "Generar"}
                        </button>
                    </div>
                </div>

                {mensaje && <div className="alert alert-warning">{mensaje}</div>}

                {data.length > 0 && (
                    <div className="table-responsive mt-4">
                        <table className="table table-bordered table-striped">
                            <thead className="table-dark">
                            <tr>
                                {Object.keys(data[0]).map((col) => (
                                    <th key={col}>{col}</th>
                                ))}
                            </tr>
                            </thead>
                            <tbody>
                            {data.map((row, i) => (
                                <tr key={i}>
                                    {Object.entries(row).map(([key, val], j) => (
                                        <td key={j}>
                                            {key.toLowerCase().includes("fecha")
                                                ? new Date(val as string).toLocaleString("es-GT", {
                                                    dateStyle: "short",
                                                    timeStyle: "short",
                                                })
                                                : String(val)}
                                        </td>
                                    ))}

                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
