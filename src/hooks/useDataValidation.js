import { useMemo } from 'react';

export const useDataValidation = () => {
  const validateEntityData = (entity, entityType = 'paciente') => {
    const missingFields = [];
    
    // Campos críticos que siempre deben estar presentes
    const criticalFields = {
      document_type: 'Tipo de Documento',
      document_number: 'Número de Documento', 
      birth_date: 'Fecha de Nacimiento'
    };

    // Campos básicos importantes
    const basicFields = {
      paternal_lastname: 'Apellido Paterno',
      maternal_lastname: 'Apellido Materno',
      name: 'Nombres'
    };

    // Verificar campos críticos
    Object.keys(criticalFields).forEach(field => {
      const value = entity[field];
      if (!value || 
          (typeof value === 'string' && value.trim() === '') ||
          (field === 'birth_date' && value === null)) {
        missingFields.push(field);
      }
    });

    // Verificar campos básicos
    Object.keys(basicFields).forEach(field => {
      const value = entity[field];
      if (!value || 
          (typeof value === 'string' && value.trim() === '')) {
        missingFields.push(field);
      }
    });

    const hasCriticalFieldsMissing = missingFields.some(field => 
      Object.keys(criticalFields).includes(field)
    );

    const hasAnyMissingFields = missingFields.length > 0;

    const result = {
      isValid: !hasAnyMissingFields,
      hasCriticalFieldsMissing,
      missingFields,
      missingFieldsCount: missingFields.length,
      canEdit: !hasCriticalFieldsMissing, // Solo se puede editar si no faltan campos críticos
      entityName: entityType === 'paciente' 
        ? `${entity.paternal_lastname || ''} ${entity.maternal_lastname || ''} ${entity.name || ''}`.trim()
        : `${entity.paternal_lastname || ''} ${entity.maternal_lastname || ''} ${entity.name || ''}`.trim()
    };

    return result;
  };

  const getValidationMessage = (validationResult, entityType = 'paciente') => {
    if (validationResult.isValid) {
      return null;
    }

    if (validationResult.hasCriticalFieldsMissing) {
      return `El ${entityType.toLowerCase()} no puede ser editado debido a que faltan datos críticos como tipo de documento, número de documento o fecha de nacimiento.`;
    }

    return `El ${entityType.toLowerCase()} tiene algunos datos incompletos que se recomienda completar.`;
  };

  return {
    validateEntityData,
    getValidationMessage
  };
};
