import React, {
  createContext,
  useState,
  useEffect,
  useCallback,
  useContext,
} from 'react';
import {
  getProfile,
  getUserPhoto,
} from '../features/configuration/cProfile/service/profileService';
import { persistLocalStorage } from '../utils/localStorageUtility';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [profile, setProfile] = useState(null);
  const [photoUrl, setPhotoUrl] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUserData = useCallback(async () => {
    setLoading(true);
    try {
      const profileData = await getProfile();
      setProfile(profileData);
      persistLocalStorage('user_full_name', profileData?.full_name);

      // Usamos una promesa separada para la foto para no bloquear el perfil si falla
      try {
        const photoDataUrl = await getUserPhoto();
        setPhotoUrl(photoDataUrl);
      } catch (photoError) {
        console.error('Error fetching user photo for context', photoError);
        setPhotoUrl(null); // O una imagen por defecto
      }
    } catch (error) {
      console.error('Error fetching user data for context', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  // El valor del contexto incluye los datos y la función para refrescar
  const value = {
    profile,
    photoUrl,
    loading,
    refetchUserData: fetchUserData,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
