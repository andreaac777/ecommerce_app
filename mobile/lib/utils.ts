import { Order } from "@/types";

export const capitalizeFirstLetter = (text: string) => {
    return text.charAt(0).toUpperCase() + text.slice(1);
};

export const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-CO", { month: "short", day: "numeric", year: "numeric" });
};

export const getOrderStatus = (status: Order["status"]) => {
    switch (status.toLowerCase()) {
        case "pending":
            return {
                label: "Pendiente",
                color: "#F59E0B",
            };
        case "paid":
            return {
                label: "Pagado",
                color: "#3B82F6",
            };
        case "delivered":
            return {
                label: "Entregado",
                color: "#10B981",
            };
        default:
            return {
                label: "",
                color: "#FFFFFF",
            };
    }
};