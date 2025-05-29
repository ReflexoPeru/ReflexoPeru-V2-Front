import { useEffect, useState } from "react"
import { getUsers } from "./usersServices";

export const useUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const data = await getUsers();
                const formattedData = data.map(user => ({
                    id: user.id,
                    name: `${user.name} ${user.paternal_lastname} ${user.maternal_lastname}`,
                    email: user.email,
                    role: user.role?.name || 'Sin rol', 
                    account_statement: user.account_statement === 1 ? 'Habilitado' : 'Deshabilitado',
                }));
                setUsers(formattedData);
            } catch (error) {
                console.error('Error al cargar usuarios:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    return {users, loading};
}