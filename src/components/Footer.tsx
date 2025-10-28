import React from "react";

const Footer: React.FC = () => {
    return (
        <footer className="bg-dark text-white text-center py-3 mt-auto">
            <p className="mb-0">
                © {new Date().getFullYear()} eCommerce GT — Desarrollado por David Barreno
            </p>
        </footer>
    );
};

export default Footer;
