import { useState, useEffect } from 'react';
import { 
  getContraceptiveMethods, 
  getDiuTypes,
  createContraceptiveMethod,
  updateContraceptiveMethod,
  deleteContraceptiveMethod,
  createDiuType,
  updateDiuType,
  deleteDiuType
} from '../service/contraceptiveService';
import { useToast } from '../../../../services/toastify/ToastContext';

export const useContraceptiveMethods = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  const fetchData = async () => {
    setLoading(true);
    try {
      const methods = await getContraceptiveMethods();
      setData(methods);
    } catch (error) {
      showToast('error', 'Error al cargar los métodos anticonceptivos');
    } finally {
      setLoading(false);
    }
  };

  const createMethod = async (methodData) => {
    try {
      const newMethod = await createContraceptiveMethod(methodData);
      setData(prev => [...prev, newMethod]);
      return newMethod;
    } catch (error) {
      const errorMessage = error?.response?.data?.message || 'Error al crear el método anticonceptivo';
      showToast('error', errorMessage);
      throw error;
    }
  };

  const updateMethod = async (id, methodData) => {
    try {
      const updatedMethod = await updateContraceptiveMethod(id, methodData);
      setData(prev => prev.map(method => 
        method.id === id ? updatedMethod : method
      ));
      return updatedMethod;
    } catch (error) {
      const errorMessage = error?.response?.data?.message || 'Error al actualizar el método anticonceptivo';
      showToast('error', errorMessage);
      throw error;
    }
  };

  const deleteMethod = async (id) => {
    try {
      await deleteContraceptiveMethod(id);
      setData(prev => prev.filter(method => method.id !== id));
    } catch (error) {
      const errorMessage = error?.response?.data?.message || 'Error al eliminar el método anticonceptivo';
      showToast('error', errorMessage);
      throw error;
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return {
    data,
    loading,
    refetch: fetchData,
    createMethod,
    updateMethod,
    deleteMethod,
  };
};

export const useDiuTypes = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  const fetchData = async () => {
    setLoading(true);
    try {
      const types = await getDiuTypes();
      setData(types);
    } catch (error) {
      showToast('error', 'Error al cargar los tipos DIU');
    } finally {
      setLoading(false);
    }
  };

  const createType = async (typeData) => {
    try {
      const newType = await createDiuType(typeData);
      setData(prev => [...prev, newType]);
      return newType;
    } catch (error) {
      const errorMessage = error?.response?.data?.message || 'Error al crear el tipo DIU';
      showToast('error', errorMessage);
      throw error;
    }
  };

  const updateType = async (id, typeData) => {
    try {
      const updatedType = await updateDiuType(id, typeData);
      setData(prev => prev.map(type => 
        type.id === id ? updatedType : type
      ));
      return updatedType;
    } catch (error) {
      const errorMessage = error?.response?.data?.message || 'Error al actualizar el tipo DIU';
      showToast('error', errorMessage);
      throw error;
    }
  };

  const deleteType = async (id) => {
    try {
      await deleteDiuType(id);
      setData(prev => prev.filter(type => type.id !== id));
    } catch (error) {
      const errorMessage = error?.response?.data?.message || 'Error al eliminar el tipo DIU';
      showToast('error', errorMessage);
      throw error;
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return {
    data,
    loading,
    refetch: fetchData,
    createType,
    updateType,
    deleteType,
  };
};
