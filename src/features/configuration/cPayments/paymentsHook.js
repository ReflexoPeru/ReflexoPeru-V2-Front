import { useEffect, useState } from "react";
import { getPayments, getPrices } from "./paymentsServices";

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

export const usePrices = () => {
    const [prices, setPrices] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPrices = async () => {
            try {
                const response = await getPrices();
                const formatted = response.map((item) => ({
                    id: item.id,
                    name: item.name,
                    price: `S/ ${parseFloat(item.price).toFixed(2)}`,
                    status: item.deleted_at ? 'Deshabilitado' : 'Habilitado',
                }));
                setPrices(formatted);
            } catch (error) {
                console.error('Error al cargar precios:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchPrices();
    }, []);

    return { prices, loading };
}