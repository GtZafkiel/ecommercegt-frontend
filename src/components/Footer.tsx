import React from "react";

const Footer: React.FC = () => {
    return (
        <footer className="bg-success text-white text-center py-3 mt-auto shadow-sm">
            <div className="container">
                <p className="mb-1 fw-semibold">
                    © {new Date().getFullYear()} <span className="fw-bold">eCommerce GT</span>
                </p>
                <small className="text-light text-opacity-75">
                    Desarrollado por <span className="fw-semibold">David Barreno</span> — Proyecto 2: Manejo e Implementación de Archivos
                </small>
            </div>
        </footer>
    );
};

export default Footer;
