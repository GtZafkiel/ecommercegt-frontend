import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import api from "../services/api";
import { setToken, isAuthenticated } from "../utils/auth";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPass] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null); // nuevo estado
    const navigate = useNavigate();
    const location = useLocation() as any;
    const from = location.state?.from?.pathname || "/dashboard";

    // Si ya tiene sesión activa, redirige automáticamente
    useEffect(() => {
        if (isAuthenticated()) {
            navigate("/dashboard", { replace: true });
        }
    }, [navigate]);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        try {
            // Enviar credenciales al backend
            const response = await api.post("/auth/login", { email, password });
            const { token, user } = response.data;

            // Guardar datos del usuario
            const userData = {
                usuarioId: user.usuarioId,
                username: user.username,
                email: user.email,
                role: user.role,
            };

            setToken(token);
            localStorage.setItem("user", JSON.stringify(userData));

            // Mostrar mensaje de bienvenida
            setSuccess(`Bienvenido, ${user.username}`);
            setTimeout(() => navigate(from, { replace: true }), 2000);
        } catch (err: any) {
            console.error("Error en login:", err);

            // Detectar tipo de error
            if (err?.response?.status === 401) {
                const mensaje = err?.response?.data;

                if (mensaje === "Usuario no encontrado") {
                    setError("El correo no existe o el usuario no está registrado");
                } else if (mensaje === "Contraseña incorrecta") {
                    setError("La contraseña ingresada es incorrecta");
                } else {
                    setError("Credenciales incorrectas o usuario no encontrado");
                }
            } else {
                setError("Error en el servidor. Intenta de nuevo más tarde.");
            }
        }
    }

    return (
        <div className="container d-flex justify-content-center align-items-center vh-100">
            <div className="card shadow-sm p-4" style={{ width: "22rem" }}>
                <h2 className="text-center mb-4">Iniciar sesión</h2>

                {/*Alerta de error */}
                {error && (
                    <div className="alert alert-danger py-2 text-center">{error}</div>
                )}

                {/*Alerta de éxito */}
                {success && (
                    <div className="alert alert-success py-2 text-center">{success}</div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label">Email</label>
                        <input
                            type="email"
                            className="form-control"
                            placeholder="Ingrese su correo"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Contraseña</label>
                        <input
                            type="password"
                            className="form-control"
                            placeholder="Ingrese su contraseña"
                            value={password}
                            onChange={(e) => setPass(e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit" className="btn btn-success w-100">
                        Ingresar
                    </button>

                    <div className="text-center mt-3">
                        <span className="text-muted">¿No tienes cuenta?</span>{" "}
                        <Link to="/register" className="link-success text-decoration-none">
                            Crear una cuenta
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
