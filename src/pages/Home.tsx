import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { isAuthenticated } from "../utils/auth";

export default function Home() {
    const navigate = useNavigate();

    useEffect(() => {
        // PROTECCION DE LOGIN
        if (isAuthenticated()) {
            navigate("/dashboard", { replace: true });
        }
    }, [navigate]);

    return (
        <div className="d-flex flex-column justify-content-center align-items-center vh-100 bg-light text-center">
            <h1 className="fw-bold mb-2">
                <span className="text-success">Bienvenido a</span>{" "}
                <span className="text-dark">E-Commerce GT</span>
            </h1>

            <img
                src="https://cdn-icons-png.flaticon.com/512/891/891462.png"
                alt="Carrito de compras"
                width="120"
                height="120"
                className="mb-4"
            />
            <div className="d-flex gap-3">
                <button
                    onClick={() => navigate("/login")}
                    className="btn btn-success text-white px-4 py-2"
                >
                    Ingresar
                </button>
                <button
                    onClick={() => navigate("/register")}
                    className="btn btn-warning text-dark px-4 py-2"
                >
                    Registrarse
                </button>
            </div>
        </div>
    );
}
