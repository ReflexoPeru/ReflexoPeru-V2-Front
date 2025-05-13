import React from 'react';
import estilo from './citas.module.css';
import ModeloTable from '../../../components/Table/Tabla'; 
import Appointments from '../../../mock/Appointments';
import { Space, Button } from 'antd';

export default function Citas() {
    const columns = [
        {
            title: 'Nro Ticket',
            dataIndex: 'nro_ticket',
            key: 'nro_ticket',
            width: '70px',
        },
        {
            title: 'Paciente',
            key: 'paciente',
            width: '150px',
            render: (text, record) => {
                return `${record.paciente_lastnamePaternal} ${record.paciente_lastnameMaternal} ${record.paciente_name}`;
            },
        },
        {
            title: 'Sala',
            dataIndex: 'room',
            key: 'room',
            width: '60px',
        },
        {
            title: 'Hora',
            dataIndex: 'hour',
            key: 'hour',
            width: '70px',
        },
        {
            title: 'Pago',
            dataIndex: 'payment',
            key: 'payment',
            width: '70px',
        },
        {
            title: 'Metodo Pago',
            dataIndex: 'paymentDetail',
            key: 'paymentDetail',
            width: '80px',
        },
    ];

    const appointmentsData = Appointments[0].items;

    return (
        <>
            <ModeloTable 
                columns={columns} 
                data={appointmentsData}
            />
        </>
        
    );
}
