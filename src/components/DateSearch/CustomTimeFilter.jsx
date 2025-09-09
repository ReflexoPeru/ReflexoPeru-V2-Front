import React, { useState, useRef } from 'react';
import { DatePicker } from 'antd';
import es_ES from 'antd/lib/locale/es_ES';
import dayjs from '../../utils/dayjsConfig';
import { CalendarOutlined } from '@ant-design/icons';

const CustomTimeFilter = ({
  onDateChange,
  size = 'large',
  style = {},
  width = '200px',
  showTime = false,
  format = 'DD-MM-YYYY',
  value,
}) => {
  const [selectDate, setSelectDate] = useState(value || dayjs());
  const datePickerRef = useRef(null);

  const handleDateChange = (date) => {
    setSelectDate(date);
    onDateChange(date);
  };

  // Función para abrir el calendario cuando se hace clic en el ícono
  const handleIconClick = (e) => {
    e.stopPropagation(); // Previene que se propague el evento
    if (datePickerRef.current) {
      datePickerRef.current.picker?.setOpen(true);
    }
  };

  // Custom suffix icon que abre el calendario al hacer clic
  const customSuffixIcon = (
    <CalendarOutlined
      style={{
        color: '#00AA55',
        fontSize: '16px',
        cursor: 'pointer',
      }}
      onClick={handleIconClick}
    />
  );

  return (
    <DatePicker
      ref={datePickerRef}
      size={size}
      onChange={handleDateChange}
      value={selectDate}
      format={format}
      showTime={showTime}
      suffixIcon={customSuffixIcon}
      allowClear={false} // ← ESTA ES LA CLAVE: Desactiva la "X"
      style={{
        width: width,
        boxShadow: 'none',
        ...style,
      }}
      placeholder="Filtrar fecha"
    />
  );
};

export default CustomTimeFilter;
