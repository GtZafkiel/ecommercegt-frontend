import React from "react";
import { Link } from "react-router-dom";

export default function ModeradorPanel() {
    return (
        <div className="container mt-4">
            <h3 className="mb-3">Panel del Moderador</h3>
            <p>Seleccione una acción:</p>
            <div className="d-flex gap-2">
                <Link to="/dashboard/moderador/solicitudes" className="btn btn-primary">
                    Revisar Solicitudes de Productos
                </Link>
                <Link to="/dashboard/moderador/sanciones" className="btn btn-warning">
                    Gestionar Sanciones
                </Link>
            </div>
        </div>
    );
}
