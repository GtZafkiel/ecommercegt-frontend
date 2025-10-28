import React, {useEffect} from "react";
import {useNavigate} from "react-router-dom";
import {isAuthenticated} from "../utils/auth";

export default function Home() {
    const navigate = useNavigate();

    useEffect(() => {
        // Si el usuario ya está logueado, redirige al dashboard
        if (isAuthenticated()) {
            navigate("/dashboard", {replace: true});
        }
    }, [navigate]);

    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <h1 className="text-3xl font-bold mb-4">Bienvenido a E-Commerce GT</h1>
            <p>Plataforma para comprar y vender productos en línea.</p>
            <button
                onClick={() => navigate("/login")}
                className="bg-blue-600 text-white mt-6 px-4 py-2 rounded"
            >
                Ingresar
            </button>
            <button
                onClick={() => navigate("/register")}
                className="btn btn-outline-secondary mt-3 ms-2 px-4 py-2"
            >
                Registrarse
            </button>
        </div>
    );
}
