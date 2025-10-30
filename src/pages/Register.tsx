import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { isAuthenticated } from "../utils/auth";

export default function Register() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPass] = useState("");
    const [confirm, setConfirm] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        if (isAuthenticated()) navigate("/dashboard", { replace: true });
    }, [navigate]);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        if (password !== confirm) {
            setError("Las contraseñas no coinciden");
            return;
        }

        try {
            setLoading(true);

            const payload = {
                username,
                email,
                passwordHash: password,
            };

            const response = await api.post("/auth/register", payload);

            const msg =
                typeof response.data === "string"
                    ? response.data
                    : response.data.message || "Usuario creado correctamente";

            setSuccess(msg);
            setTimeout(() => navigate("/login", { replace: true }), 2000);
        } catch (err: any) {
            console.error("Error en registro:", err);

            const backendMsg =
                err?.response?.data && typeof err.response.data === "string"
                    ? err.response.data
                    : err?.response?.data?.message;

            setError(backendMsg || "No se pudo registrar. Verifica los datos.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="container d-flex justify-content-center align-items-center vh-100">
            <div className="card shadow-sm p-4" style={{ width: "26rem" }}>
                <h2 className="text-center mb-3">Crear cuenta</h2>

                {error && <div className="alert alert-danger py-2 text-center">{error}</div>}

                {success && <div className="alert alert-success py-2 text-center">{success}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label">Usuario</label>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Tu nombre de usuario"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            minLength={3}
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Email</label>
                        <input
                            type="email"
                            className="form-control"
                            placeholder="tucorreo@dominio.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="row">
                        <div className="mb-3 col-12 col-md-6">
                            <label className="form-label">Contraseña</label>
                            <input
                                type="password"
                                className="form-control"
                                placeholder="Mínimo 8 caracteres"
                                value={password}
                                onChange={(e) => setPass(e.target.value)}
                                required
                                minLength={8}
                            />
                        </div>

                        <div className="mb-3 col-12 col-md-6">
                            <label className="form-label">Confirmar contraseña</label>
                            <input
                                type="password"
                                className="form-control"
                                placeholder="Repite la contraseña"
                                value={confirm}
                                onChange={(e) => setConfirm(e.target.value)}
                                required
                                minLength={8}
                            />
                        </div>
                    </div>

                    <button type="submit" className="btn btn-success w-100" disabled={loading}>
                        {loading ? "Creando..." : "Crear cuenta"}
                    </button>
                </form>

                <div className="text-center mt-3">
                    <span className="text-muted">¿Ya tienes cuenta?</span>{" "}
                    <a href="/login" className="link-success text-decoration-none">
                        Iniciar sesión
                    </a>
                </div>
            </div>
        </div>
    );
}
