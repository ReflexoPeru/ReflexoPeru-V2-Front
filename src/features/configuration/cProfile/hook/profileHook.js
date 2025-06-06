import { useState, useEffect } from 'react'; // Añadir useEffect al import
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
      showToast('codigoEnviado');
      return response;
    } catch (err) {
      setError(err);
      showToast('intentoFallido', err.response?.data?.message);
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
      showToast('codigoIncorrecto', err.response?.data?.message);
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
      showToast('exito', 'Correo electrónico actualizado con éxito');
      return response;
    } catch (err) {
      setError(err);
      showToast(
        'error',
        err.response?.data?.message || 'Error al actualizar el correo',
      );
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
  const { showToast } = useToast();

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
        setPhoto('/src/assets/Img/MiniLogoReflexo.webp');
      }
    } catch (error) {
      setError(error);
      showToast('error', 'Error al cargar el perfil');
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
  const { showToast } = useToast();

  const updateProfile = async (data) => {
    try {
      setIsUpdating(true);
      setUpdateError(null);
      const updatedProfile = await updateAllProfile(data);
      showToast('exito', 'Perfil actualizado correctamente');
      return updatedProfile;
    } catch (error) {
      setUpdateError(error);
      showToast(
        'error',
        error.response?.data?.message || 'Error al actualizar el perfil',
      );
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
      showToast('exito', 'Contraseña verificada correctamente');
      return response;
    } catch (error) {
      showToast('contraseñaIncorrecta');
      throw error;
    }
  };

  const updatePassword = async (newPassword) => {
    try {
      const response = await changePassword({ password: newPassword });
      showToast('contraseñaCambiada');
      return response;
    } catch (error) {
      showToast(
        'error',
        error.response?.data?.message || 'Error al cambiar la contraseña',
      );
      throw error;
    }
  };

  const uploadProfilePhoto = async (file) => {
    try {
      const formData = new FormData();
      formData.append('photo', file);
      const response = await uploadPhoto(formData);
      showToast('exito', 'Foto de perfil actualizada');
      return response;
    } catch (error) {
      showToast('error', 'Error al subir la foto de perfil');
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
