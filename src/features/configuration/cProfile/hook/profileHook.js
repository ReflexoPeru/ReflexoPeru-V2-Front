import { useState, useEffect } from 'react';
import {
  createPatient,
  verifyCode,
  updateProfileEmail,
  getProfile,
  updateAllProfile,
  validatePassword,
  changePassword,
  uploadPhoto,
  getPhoto,
} from '../service/profileService';
import { useToast } from '../../../../services/toastify/ToastContext';

export const useSendVerifyCode = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { showToast } = useToast();
  const sendCode = async (email) => {
    setLoading(true);
    setError(null);
    try {
      const data = {
        type_email: '2',
        new_email: email,
      };
      const response = await createPatient(data);
      return response;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const verify = async (code) => {
    setLoading(true);
    setError(null);
    try {
      const response = await verifyCode(code);
      return response;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateEmail = async (email) => {
    setLoading(true);
    setError(null);
    try {
      const response = await updateProfileEmail(email);
      return response;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    sendCode,
    verify,
    updateEmail,
    loading,
    error,
  };
};

export const useProfile = () => {
  const [profile, setProfile] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const data = await getProfile();
      setProfile(data);

      // Obtener foto de perfil
      try {
        const photoData = await getPhoto();
        if (photoData) {
          setPhoto(URL.createObjectURL(photoData));
        }
      } catch (photoError) {
        console.error('Error fetching photo:', photoError);
        setPhoto('/src/assets/Img/MiniLogoReflexo.webp'); // Imagen por defecto
      }
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return {
    profile,
    photo,
    setPhoto,
    loading,
    error,
    refetch: fetchProfile,
  };
};

export const useUpdateProfile = () => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateError, setUpdateError] = useState(null);

  const updateProfile = async (data) => {
    try {
      setIsUpdating(true);
      setUpdateError(null);
      const updatedProfile = await updateAllProfile(data);
      return updatedProfile;
    } catch (error) {
      setUpdateError(error);
      throw error;
    } finally {
      setIsUpdating(false);
    }
  };

  const validateCurrentPassword = async (currentPassword) => {
    try {
      const response = await validatePassword({
        current_password: currentPassword,
      });
      return response;
    } catch (error) {
      throw error;
    }
  };

  const updatePassword = async (newPassword) => {
    try {
      const response = await changePassword({ password: newPassword });
      return response;
    } catch (error) {
      throw error;
    }
  };

  const uploadProfilePhoto = async (file) => {
    try {
      const formData = new FormData();
      formData.append('photo', file);
      const response = await uploadPhoto(formData);
      return response;
    } catch (error) {
      throw error;
    }
  };

  return {
    updateProfile,
    validateCurrentPassword,
    updatePassword,
    uploadProfilePhoto,
    isUpdating,
    error: updateError,
  };
};
