import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedRoute from "./components/ProtectedRoute";
import DashboardLayout from "./layouts/DashboardLayout";

// ==== Usuario Común ====
import ComunPanel from "./pages/dashboard/ComunPanel";
import MisProductos from "./pages/dashboard/MisProductos";
import NuevoProducto from "./pages/dashboard/NuevoProducto";
import EditarProducto from "./pages/dashboard/EditarProducto";
import Carrito from "./pages/dashboard/Carrito";
import Tarjetas from "./pages/dashboard/Tarjetas";
import Pedidos from "./pages/dashboard/Pedidos";
import Resenas from "./pages/dashboard/Resenas";
import Perfil from "./pages/dashboard/Perfil";
import Tienda from "./pages/dashboard/Tienda";
import MisCompras from "./pages/dashboard/MisCompras";
import DetalleProducto from "./pages/dashboard/DetalleProducto";

// ==== Moderador ====
import ModeradorPanel from "./pages/dashboard/ModeradorPanel";
import SolicitudesProductos from "./pages/dashboard/SolicitudesProductos";
import Sanciones from "./pages/dashboard/Sanciones";

// ==== Logística ====
import LogisticaPanel from "./pages/dashboard/LogisticaPanel";
import PedidosLogistica from "./pages/dashboard/PedidosLogistica";

// ==== Administrador ====
import AdminPanel from "./pages/dashboard/AdminPanel";
import AdminUsuarios from "./pages/dashboard/AdminUsuarios";
import AdminUsuarioForm from "./pages/dashboard/AdminUsuarioForm";
import DashboardRedirect from "./pages/dashboard/DashboardRedirect";
import AdminReportes from "./pages/dashboard/AdminReportes";

const router = createBrowserRouter([
    { path: "/", element: <Home /> },
    { path: "/login", element: <Login /> },
    { path: "/register", element: <Register /> },

    {
        element: <ProtectedRoute />, // Solo autenticados
        children: [
            {
                path: "/dashboard",
                element: <DashboardLayout />,
                children: [
                    // Redirección automática al panel correcto según el rol
                    { index: true, element: <DashboardRedirect /> },

                    // ==== Usuario Común ====
                    {
                        element: <ProtectedRoute allowedRoles={["COMUN"]} />,
                        children: [
                            { path: "comun", element: <ComunPanel /> },
                            { path: "mis-productos", element: <MisProductos /> },
                            { path: "mis-productos/nuevo", element: <NuevoProducto /> },
                            { path: "mis-productos/editar/:productoId", element: <EditarProducto /> },
                            { path: "tienda", element: <Tienda /> },
                            { path: "producto/:id", element: <DetalleProducto /> },
                            { path: "carrito", element: <Carrito /> },
                            { path: "tarjetas", element: <Tarjetas /> },
                            { path: "mis-compras", element: <MisCompras /> },
                            { path: "pedidos", element: <Pedidos /> },
                            { path: "resenas", element: <Resenas /> },
                            { path: "perfil", element: <Perfil /> },
                        ],
                    },

                    // ==== Moderador ====
                    {
                        element: <ProtectedRoute allowedRoles={["MODERADOR"]} />,
                        children: [
                            { path: "moderador", element: <ModeradorPanel /> },
                            { path: "moderador/solicitudes", element: <SolicitudesProductos /> },
                            { path: "moderador/sanciones", element: <Sanciones /> },
                        ],
                    },

                    // ==== Logística ====
                    {
                        element: <ProtectedRoute allowedRoles={["LOGISTICA"]} />,
                        children: [
                            { path: "logistica", element: <LogisticaPanel /> },
                            { path: "logistica/pedidos", element: <PedidosLogistica /> },
                        ],
                    },

                    // ==== Administrador ====
                    {
                        element: <ProtectedRoute allowedRoles={["ADMIN"]} />,
                        children: [
                            { path: "admin", element: <AdminPanel /> },
                            { path: "admin/usuarios", element: <AdminUsuarios /> },
                            { path: "admin/usuarios/nuevo", element: <AdminUsuarioForm mode="create" /> },
                            { path: "admin/usuarios/editar/:usuarioId", element: <AdminUsuarioForm mode="edit" /> },
                            { path: "admin/reportes", element: <AdminReportes /> },
                        ],
                    },
                ],
            },
        ],
    },
]);

export default function App() {
    return <RouterProvider router={router} />;
}
