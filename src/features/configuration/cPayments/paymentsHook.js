import { useEffect, useState } from "react";
import { getPayments } from "./paymentsServices";

export const usePaymentTypes = () => {
    const [paymentTypes, setPaymentTypes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPaymentTypes = async () => {
        try {
            const data = await getPayments();
            const formatted = data.map((item) => ({
                id: item.id,
                name: item.name,
                status: item.deleted_at ? 'Deshabilitado' : 'Habilitado',
            }));
            setPaymentTypes(formatted);
        } catch (error) {
            console.error('Error al cargar tipos de pago:', error);
        } finally {
            setLoading(false);
        }
        };

        fetchPaymentTypes();
    }, []);

    return { paymentTypes, loading };
};