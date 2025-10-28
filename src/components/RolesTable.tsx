import { useEffect, useState } from "react";
import { api } from "../services/api";

interface Role {
    role_id: number;
    code: string;
    name: string;
    description: string;
}

export default function RolesTable() {
    const [roles, setRoles] = useState<Role[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api
            .get("/roles")
            .then((res) => {
                setRoles(res.data);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Error al cargar roles:", err);
                setLoading(false);
            });
    }, []);

    return (
        <div className="container py-5">
            <div className="text-center mb-4">
                <h2 className="fw-bold text-primary">LISTADO DE ROLES DISPONIBLES</h2>
            </div>

            {loading ? (
                <div
                    className="d-flex justify-content-center align-items-center"
                    style={{ height: "200px" }}
                >
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Cargando...</span>
                    </div>
                </div>
            ) : (
                <div className="table-responsive">
                    <table className="table table-striped">
                        <thead>
                        <tr>
                            <th scope="col">No.</th>
                            <th scope="col">Tipo</th>
                            <th scope="col">Nombre</th>
                            <th scope="col">Descripción</th>
                        </tr>
                        </thead>
                        <tbody>
                        {roles.map((r) => (
                            <tr key={r.role_id}>
                                <td>{r.role_id}</td>
                                <td>{r.code}</td>
                                <td>{r.name}</td>
                                <td>{r.description || "Sin descripción"}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
