import axios from "axios";
import { get } from "../../../services/api/Axios/MethodsGeneral";

export const getPayments = async ()=> {
    try {
        const res = await get(`payment-types`);
        return res.data;
    } catch (error) {
        console.error("Error en getPayments:", error);
        throw error;
    }
};