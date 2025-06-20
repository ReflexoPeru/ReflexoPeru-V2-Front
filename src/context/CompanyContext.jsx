import React, {
  createContext,
  useState,
  useEffect,
  useCallback,
  useContext,
} from 'react';
import {
  getSystemInfo,
  getCompanyLogo,
} from '../features/configuration/cSystem/services/systemServices';
import { persistLocalStorage } from '../utils/localStorageUtility';

const CompanyContext = createContext();

export const CompanyProvider = ({ children }) => {
  const [companyInfo, setCompanyInfo] = useState(null);
  const [logoUrl, setLogoUrl] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchCompanyData = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getSystemInfo();
      setCompanyInfo(data?.data);
      if (data?.data?.company_name) {
        persistLocalStorage('company_name', data.data.company_name);
      }
      try {
        const logoBlob = await getCompanyLogo();
        const url = URL.createObjectURL(logoBlob);
        setLogoUrl(url);
      } catch (logoError) {
        setLogoUrl(null);
      }
    } catch (error) {
      setCompanyInfo(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCompanyData();
    // Limpieza de URL de logo
    return () => {
      if (logoUrl) URL.revokeObjectURL(logoUrl);
    };
  }, [fetchCompanyData]);

  const value = {
    companyInfo,
    logoUrl,
    loading,
    refetchCompanyData: fetchCompanyData,
  };

  return (
    <CompanyContext.Provider value={value}>{children}</CompanyContext.Provider>
  );
};

export const useCompany = () => {
  const context = useContext(CompanyContext);
  if (context === undefined) {
    throw new Error('useCompany must be used within a CompanyProvider');
  }
  return context;
};
