import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { isAuthenticated, getUserRole } from "../utils/auth";

interface ProtectedRouteProps {
    allowedRoles?: string[];
}

export default function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
    const location = useLocation();

    // Se usa para verificar si el usuario está autenticado
    if (!isAuthenticated()) {
        return <Navigate to="/login" replace state={{ from: location }} />;
    }

    // Se usa para obtener el rol del usuario desde el JWT
    const userRole = getUserRole();

    // Si la ruta tiene restricciones de rol y el usuario no pertenece a ellas
    if (allowedRoles && !allowedRoles.includes(userRole || "")) {
        return <Navigate to="/dashboard" replace />;
    }

    return <Outlet />;
}
