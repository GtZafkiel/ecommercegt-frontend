import React from "react";
import { Link } from "react-router-dom";

interface HeaderProps {
    role: string;
    name?: string;
    onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ role, name, onLogout }) => {
    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-3">
            <Link className="navbar-brand fw-bold text-white" to="/dashboard">
                eCommerce GT
            </Link>

            <button
                className="navbar-toggler"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#navbarNav"
            >
                <span className="navbar-toggler-icon"></span>
            </button>

            <div className="collapse navbar-collapse" id="navbarNav">
                <ul className="navbar-nav me-auto">
                    {/* Panel administrador */}
                    {role === "ADMIN" && (
                        <>
                            <li className="nav-item">
                                <Link className="nav-link" to="/dashboard/admin">
                                    Panel Admin
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/dashboard/reportes">
                                    Reportes
                                </Link>
                            </li>
                        </>
                    )}

                    {/* Panel moderador */}
                    {role === "MODERADOR" && (
                        <>
                            <li className="nav-item">
                                <Link className="nav-link" to="/dashboard/moderador">
                                    Solicitudes
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/dashboard/sanciones">
                                    Sanciones
                                </Link>
                            </li>
                        </>
                    )}

                    {/* Panel logística */}
                    {role === "LOGISTICA" && (
                        <>
                            <li className="nav-item">
                                <Link className="nav-link" to="/dashboard/logistica">
                                    Pedidos en Curso
                                </Link>
                            </li>
                        </>
                    )}

                    {/* Panel usuario común */}
                    {role === "COMUN" && (
                        <>
                            <li className="nav-item">
                                <Link className="nav-link" to="/dashboard">
                                    Inicio
                                </Link>
                            </li>

                            {/* Dropdown de productos */}
                            <li className="nav-item dropdown">
                                <a
                                    className="nav-link dropdown-toggle"
                                    href="#"
                                    id="productosDropdown"
                                    role="button"
                                    data-bs-toggle="dropdown"
                                    aria-expanded="false"
                                >
                                    Mis Productos
                                </a>
                                <ul className="dropdown-menu" aria-labelledby="productosDropdown">
                                    <li>
                                        <Link className="dropdown-item" to="/dashboard/mis-productos">
                                            Mis Publicaciones
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            className="dropdown-item"
                                            to="/dashboard/mis-productos/nuevo"
                                        >
                                            Publicar Producto
                                        </Link>
                                    </li>
                                </ul>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/dashboard/tienda">
                                    Tienda
                                </Link>
                            </li>


                            {/* Carrito */}
                            <li className="nav-item">
                                <Link className="nav-link" to="/dashboard/carrito">
                                    Carrito
                                </Link>
                            </li>

                            {/* Pedidos */}
                            <li className="nav-item">
                                <Link className="nav-link" to="/dashboard/pedidos">
                                    Mis Pedidos
                                </Link>
                            </li>

                            {/* Dropdown de cuenta */}
                            <li className="nav-item dropdown">
                                <a
                                    className="nav-link dropdown-toggle"
                                    href="#"
                                    id="cuentaDropdown"
                                    role="button"
                                    data-bs-toggle="dropdown"
                                    aria-expanded="false"
                                >
                                    Cuenta
                                </a>
                                <ul className="dropdown-menu" aria-labelledby="cuentaDropdown">
                                    <li>
                                        <Link className="dropdown-item" to="/dashboard/tarjetas">
                                            Mis Tarjetas
                                        </Link>
                                    </li>
                                    <li>
                                        <Link className="dropdown-item" to="/dashboard/resenas">
                                            Mis Reseñas
                                        </Link>
                                    </li>
                                    <li>
                                        <Link className="dropdown-item" to="/dashboard/perfil">
                                            Configuración
                                        </Link>
                                    </li>
                                </ul>
                            </li>
                        </>
                    )}
                </ul>

                {/* Sección derecha: nombre, rol y botón */}
                <div className="d-flex flex-column align-items-end text-white me-3">
                    <span className="fw-semibold">{name || "Usuario"}</span>
                    <small className="text-secondary">Rol: {role}</small>
                </div>

                <button className="btn btn-outline-light btn-sm" onClick={onLogout}>
                    Cerrar sesión
                </button>
            </div>
        </nav>
    );
};

export default Header;
