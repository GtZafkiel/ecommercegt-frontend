import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function DashboardRedirect() {
    const navigate = useNavigate();

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user") || "{}");

        if (!user || !user.role) {
            navigate("/login");
            return;
        }

        switch (user.role) {
            case "ADMIN":
                navigate("/dashboard/admin");
                break;
            case "MODERADOR":
                navigate("/dashboard/moderador");
                break;
            case "LOGISTICA":
                navigate("/dashboard/logistica");
                break;
            case "COMUN":
            default:
                navigate("/dashboard/comun");
                break;
        }
    }, [navigate]);

    return null; // No muestra nada, solo redirige
}
