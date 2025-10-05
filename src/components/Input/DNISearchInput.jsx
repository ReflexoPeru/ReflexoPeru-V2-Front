import React, { useState } from 'react';
import { Input, message } from 'antd';
import { searchPatientByDNI } from '../../features/patients/service/patientsService';
import { searchPatientByDNI as searchStaffByDNI } from '../../features/staff/service/staffService';
import styles from './DNISearchInput.module.css';

const { Search } = Input;

const DNISearchInput = ({ 
  value, 
  onChange, 
  onDataFound, 
  placeholder = "Ingrese el DNI (8 dígitos)",
  disabled = false,
  searchType = 'patient', // 'patient' o 'staff'
  ...props 
}) => {
  const [isSearching, setIsSearching] = useState(false);

  const validateDNI = (dniValue) => {
    const dniRegex = /^\d{8}$/;
    return dniRegex.test(dniValue);
  };

  const handleSearch = async (searchValue) => {
    if (!searchValue || !searchValue.trim()) {
      message.warning('Por favor ingrese un número de DNI');
      return;
    }

    if (!validateDNI(searchValue)) {
      message.error('El DNI debe tener 8 dígitos');
      return;
    }

    setIsSearching(true);

    try {
      // Usar el servicio apropiado según el tipo de búsqueda
      const searchFunction = searchType === 'staff' ? searchStaffByDNI : searchPatientByDNI;
      const response = await searchFunction(searchValue);

      if (response.success) {
        onDataFound && onDataFound(response.data);
        message.success('Datos encontrados correctamente');
      } else {
        onDataFound && onDataFound(null);
        message.info(response.message || 'No se encontraron datos para este DNI');
      }
    } catch (error) {
      message.error('Error al buscar los datos del DNI');
      console.error('Error en búsqueda DNI:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleInputChange = (e) => {
    const inputValue = e.target.value.replace(/\D/g, '').slice(0, 8);
    onChange && onChange(inputValue);
  };

  return (
    <Search
      {...props}
      value={value}
      onChange={handleInputChange}
      onSearch={handleSearch}
      placeholder={placeholder}
      disabled={disabled}
      loading={isSearching}
      enterButton
      className={styles.dniSearch}
    />
  );
};

export default DNISearchInput;
