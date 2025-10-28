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
import DashboardRedirect from "./pages/dashboard/DashboardRedirect";

const router = createBrowserRouter([
    { path: "/", element: <Home /> },
    { path: "/login", element: <Login /> },
    { path: "/register", element: <Register /> },

    {
        element: <ProtectedRoute />,
        children: [
            {
                path: "/dashboard",
                element: <DashboardLayout />,
                children: [
                    // ==== Usuario Común ====
                    { index: true, element: <DashboardRedirect /> },
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

                    // ==== Moderador ====
                    { path: "moderador", element: <ModeradorPanel /> },
                    { path: "moderador/solicitudes", element: <SolicitudesProductos /> },
                    { path: "moderador/sanciones", element: <Sanciones /> },

                    // ==== Logística ====
                    { path: "logistica", element: <LogisticaPanel /> },
                    { path: "logistica/pedidos", element: <PedidosLogistica /> },

                    // ==== Administrador ====
                    { path: "admin", element: <AdminPanel /> },
                ],
            },
        ],
    },
]);

export default function App() {
    return <RouterProvider router={router} />;
}
