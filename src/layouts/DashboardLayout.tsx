import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Outlet, useNavigate } from "react-router-dom";
import { getUserRole, clearToken } from "../utils/auth";

const DashboardLayout: React.FC = () => {
    const navigate = useNavigate();

    const user = JSON.parse(localStorage.getItem("user") || "{}");

    const role = getUserRole() || "COMUN";
    const name = user?.nombre || user?.username || "Usuario";

    const handleLogout = () => {
        clearToken();
        localStorage.removeItem("user");
        navigate("/login");
    };

    return (
        <div className="d-flex flex-column min-vh-100">
            <Header role={role} name={name} onLogout={handleLogout} />
            <main className="flex-fill container my-4">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
};

export default DashboardLayout;
