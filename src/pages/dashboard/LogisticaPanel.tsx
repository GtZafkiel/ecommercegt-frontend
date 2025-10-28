import React from "react";
import { useNavigate } from "react-router-dom";

export default function LogisticaPanel() {
    const navigate = useNavigate();

    return (
        <div className="container py-4">
            <h2 className="mb-4">Panel de Logística</h2>

            <div className="card shadow-sm p-4">
                <p>Desde este panel puedes gestionar los pedidos en curso y marcar entregas.</p>
                <button
                    className="btn btn-primary"
                    onClick={() => navigate("/dashboard/logistica/pedidos")}
                >
                    Ver Pedidos en Curso
                </button>
            </div>
        </div>
    );
}
