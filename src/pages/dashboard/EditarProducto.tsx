import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getProductosByUser, actualizarProducto } from "../../services/api";

export default function EditarProducto() {
    const navigate = useNavigate();
    const { productoId } = useParams();
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    const [categorias, setCategorias] = useState<any[]>([]);
    const [formData, setFormData] = useState({
        nombre: "",
        descripcion: "",
        imagenUrl: "",
        precio: "",
        stock: 1,
        estado: "NUEVO",
        categoria: "",
    });

    const [mensaje, setMensaje] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [cargandoProducto, setCargandoProducto] = useState(true);

    useEffect(() => {
        fetch("http://localhost:8080/api/categorias")
            .then((res) => res.json())
            .then((data) => setCategorias(data))
            .catch(() => setCategorias([]));
    }, []);

    useEffect(() => {
        const cargarProducto = async () => {
            try {
                const res = await getProductosByUser(user.usuarioId);
                const producto = res.data.find(
                    (p: any) => p.productoId.toString() === productoId
                );
                if (!producto) {
                    setError("Producto no encontrado o no pertenece al usuario.");
                    setCargandoProducto(false);
                    return;
                }
                setFormData({
                    nombre: producto.nombre,
                    descripcion: producto.descripcion,
                    imagenUrl: producto.imagenUrl,
                    precio: producto.precio,
                    stock: producto.stock,
                    estado: producto.estado,
                    categoria: producto.categoria?.categoriaId?.toString() || "",
                });
            } catch (err) {
                console.error(err);
                setError("Error al cargar los datos del producto.");
            } finally {
                setCargandoProducto(false);
            }
        };
        cargarProducto();
    }, [productoId, user.usuarioId]);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setMensaje(null);
        setLoading(true);

        try {
            const payload = {
                ...formData,
                precio: parseFloat(formData.precio.toString()),
                stock: parseInt(formData.stock.toString(), 10),
                usuario: { usuarioId: user.usuarioId },
                categoria: { categoriaId: parseInt(formData.categoria) },
            };

            await actualizarProducto(Number(productoId), payload);
            setMensaje("Producto actualizado correctamente. En revisión.");
            setTimeout(() => navigate("/dashboard/mis-productos"), 1500);
        } catch (err) {
            console.error(err);
            setError("Error al actualizar el producto. Intenta nuevamente.");
        } finally {
            setLoading(false);
        }
    };

    if (cargandoProducto) {
        return (
            <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status"></div>
                <p className="mt-3">Cargando producto...</p>
            </div>
        );
    }

    return (
        <div className="container mt-4">
            <h2 className="mb-4">Editar Producto</h2>

            {mensaje && <div className="alert alert-success">{mensaje}</div>}
            {error && <div className="alert alert-danger">{error}</div>}

            <form className="border rounded p-4 shadow-sm bg-light" onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label fw-semibold">Nombre del Producto</label>
                    <input
                        type="text"
                        name="nombre"
                        className="form-control"
                        required
                        value={formData.nombre}
                        onChange={handleChange}
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label fw-semibold">Descripción</label>
                    <textarea
                        name="descripcion"
                        className="form-control"
                        rows={3}
                        required
                        value={formData.descripcion}
                        onChange={handleChange}
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label fw-semibold">URL de Imagen</label>
                    <input
                        type="text"
                        name="imagenUrl"
                        className="form-control"
                        required
                        value={formData.imagenUrl}
                        onChange={handleChange}
                    />
                </div>

                <div className="row">
                    <div className="col-md-4 mb-3">
                        <label className="form-label fw-semibold">Precio (Q)</label>
                        <input
                            type="number"
                            name="precio"
                            className="form-control"
                            min="0"
                            step="0.01"
                            required
                            value={formData.precio}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="col-md-4 mb-3">
                        <label className="form-label fw-semibold">Stock</label>
                        <input
                            type="number"
                            name="stock"
                            className="form-control"
                            min="1"
                            required
                            value={formData.stock}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="col-md-4 mb-3">
                        <label className="form-label fw-semibold">Estado</label>
                        <select
                            name="estado"
                            className="form-select"
                            value={formData.estado}
                            onChange={handleChange}
                        >
                            <option value="NUEVO">Nuevo</option>
                            <option value="USADO">Usado</option>
                        </select>
                    </div>
                </div>

                <div className="mb-4">
                    <label className="form-label fw-semibold">Categoría</label>
                    <select
                        name="categoria"
                        className="form-select"
                        value={formData.categoria}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Seleccione una categoría</option>
                        {categorias.map((c) => (
                            <option key={c.categoriaId} value={c.categoriaId}>
                                {c.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="d-flex justify-content-between">
                    <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => navigate("/dashboard/mis-productos")}
                    >
                        Cancelar
                    </button>
                    <button type="submit" className="btn btn-success" disabled={loading}>
                        {loading ? "Guardando..." : "Guardar Cambios"}
                    </button>
                </div>
            </form>
        </div>
    );
}
