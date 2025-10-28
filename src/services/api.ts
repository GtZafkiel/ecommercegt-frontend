import axios from "axios";

export const api = axios.create({
    baseURL: "http://localhost:8080/api",
});

// === PRODUCTOS ===
export const getProductosByUser = (userId: number) =>
    api.get(`/productos/usuario/${userId}`);

export const getProductoById = (id: number) =>
    api.get(`/productos/${id}`); // Nuevo endpoint individual

export const crearProducto = (data: any) => api.post(`/productos`, data);

export const actualizarProducto = (id: number, data: any) =>
    api.put(`/productos/${id}`, data);

export const eliminarProducto = (id: number) =>
    api.delete(`/productos/${id}`);

export const agregarAlCarrito = (
    usuarioId: number,
    productoId: number,
    cantidad: number
) =>
    api.post(`/carrito/${usuarioId}/agregar`, null, {
        params: { productoId, cantidad },
    });


export default api;
