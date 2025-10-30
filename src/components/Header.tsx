import React from "react";
import { Link } from "react-router-dom";

interface HeaderProps {
    role: string;
    name?: string;
    onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ role, name, onLogout }) => {
    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-success shadow-sm px-4 py-2">
            {/* ===== IZQUIERDA: Logo ===== */}
            <div className="d-flex align-items-center">
                <Link className="navbar-brand fw-bold fs-5 text-white d-flex align-items-center" to="/dashboard">
                    <i className="bi bi-bag-check-fill me-2 fs-4"></i>
                    eCommerce GT
                </Link>
            </div>

            {/* ===== Botón Responsive ===== */}
            <button
                className="navbar-toggler"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#navbarMain"
                aria-controls="navbarMain"
                aria-expanded="false"
            >
                <span className="navbar-toggler-icon"></span>
            </button>

            {/* ===== CENTRO: Menú ===== */}
            <div className="collapse navbar-collapse justify-content-center" id="navbarMain">
                <ul className="navbar-nav text-center">

                    {/* ==== ADMIN ==== */}
                    {role === "ADMIN" && (
                        <>
                            <li className="nav-item mx-2">
                                <Link className="nav-link d-flex align-items-center gap-1" to="/dashboard/admin/usuarios">
                                    <i className="bi bi-person-plus-fill"></i> Crear Usuarios
                                </Link>
                            </li>
                            <li className="nav-item mx-2">
                                <Link className="nav-link d-flex align-items-center gap-1" to="/dashboard/admin/reportes">
                                    <i className="bi bi-bar-chart-fill"></i> Reportes
                                </Link>
                            </li>
                        </>
                    )}

                    {/* ==== MODERADOR ==== */}
                    {role === "MODERADOR" && (
                        <>
                            <li className="nav-item mx-2">
                                <Link className="nav-link d-flex align-items-center gap-1" to="/dashboard/moderador/solicitudes">
                                    <i className="bi bi-card-checklist"></i> Solicitudes
                                </Link>
                            </li>
                            <li className="nav-item mx-2">
                                <Link className="nav-link d-flex align-items-center gap-1" to="/dashboard/moderador/sanciones">
                                    <i className="bi bi-shield-exclamation"></i> Sanciones
                                </Link>
                            </li>
                        </>
                    )}

                    {/* ==== LOGÍSTICA ==== */}
                    {role === "LOGISTICA" && (
                        <li className="nav-item mx-2">
                            <Link className="nav-link d-flex align-items-center gap-1" to="/dashboard/logistica/pedidos">
                                <i className="bi bi-truck"></i> Pedidos en Curso
                            </Link>
                        </li>
                    )}

                    {/* ==== COMÚN ==== */}
                    {role === "COMUN" && (
                        <>
                            <li className="nav-item mx-2">
                                <Link className="nav-link d-flex align-items-center gap-1" to="/dashboard/tienda">
                                    <i className="bi bi-shop"></i> Tienda
                                </Link>
                            </li>


                            <li className="nav-item dropdown mx-2">
                                <button
                                    className="nav-link dropdown-toggle d-flex align-items-center gap-1 bg-transparent border-0 text-white"
                                    id="productosDropdown"
                                    data-bs-toggle="dropdown"
                                    aria-expanded="false"
                                    type="button"
                                >
                                    <i className="bi bi-box-seam"></i> Mis Productos
                                </button>
                                <ul className="dropdown-menu text-center" aria-labelledby="productosDropdown">
                                    <li>
                                        <Link className="dropdown-item d-flex align-items-center gap-1" to="/dashboard/mis-productos">
                                            <i className="bi bi-collection"></i> Mis Publicaciones
                                        </Link>
                                    </li>
                                    <li>
                                        <Link className="dropdown-item d-flex align-items-center gap-1" to="/dashboard/mis-productos/nuevo">
                                            <i className="bi bi-plus-square"></i> Publicar Producto
                                        </Link>
                                    </li>
                                </ul>
                            </li>

                            <li className="nav-item mx-2">
                                <Link className="nav-link d-flex align-items-center gap-1" to="/dashboard/carrito">
                                    <i className="bi bi-cart4"></i> Carrito
                                </Link>
                            </li>
                            <li className="nav-item mx-2">
                                <Link className="nav-link d-flex align-items-center gap-1" to="/dashboard/pedidos">
                                    <i className="bi bi-receipt"></i> Mis Pedidos
                                </Link>
                            </li>
                            <li className="nav-item mx-2">
                                <Link className="nav-link d-flex align-items-center gap-1" to="/dashboard/mis-compras">
                                    <i className="bi bi-bag-heart"></i> Mis Compras
                                </Link>
                            </li>

                            <li className="nav-item dropdown mx-2">
                                <button
                                    className="nav-link dropdown-toggle d-flex align-items-center gap-1 bg-transparent border-0 text-white"
                                    id="cuentaDropdown"
                                    data-bs-toggle="dropdown"
                                    aria-expanded="false"
                                    type="button"
                                >
                                    <i className="bi bi-person-circle"></i> Cuenta
                                </button>
                                <ul className="dropdown-menu text-center" aria-labelledby="cuentaDropdown">
                                    <li>
                                        <Link className="dropdown-item d-flex align-items-center gap-1" to="/dashboard/tarjetas">
                                            <i className="bi bi-credit-card-2-front"></i> Mis Tarjetas
                                        </Link>
                                    </li>
                                    <li>
                                        <Link className="dropdown-item d-flex align-items-center gap-1" to="/dashboard/resenas">
                                            <i className="bi bi-chat-left-heart"></i> Mis Reseñas
                                        </Link>
                                    </li>
                                    <li>
                                        <Link className="dropdown-item d-flex align-items-center gap-1" to="/dashboard/perfil">
                                            <i className="bi bi-gear"></i> Configuración
                                        </Link>
                                    </li>
                                </ul>
                            </li>
                        </>
                    )}
                </ul>
            </div>

            {/* ===== DERECHA: Usuario y Botón ===== */}
            <div className="d-flex align-items-center ms-auto">
                <div className="text-end me-3">
                    <div className="fw-semibold text-white small d-flex align-items-center justify-content-end">
                        <i className="bi bi-person-fill me-1"></i> {name || "Usuario"}
                    </div>
                    <div className="text-white-50 small">
                        <i className="bi bi-shield-lock me-1"></i> Rol: {role}
                    </div>
                </div>

                <button
                    onClick={onLogout}
                    className="btn btn-light btn-sm fw-semibold d-flex align-items-center px-3"
                >
                    <i className="bi bi-box-arrow-right me-1"></i> Salir
                </button>
            </div>
        </nav>
    );
};

export default Header;
