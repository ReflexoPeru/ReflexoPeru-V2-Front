import { useState, useEffect, useCallback } from 'react';
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

// Cache para almacenar datos temporalmente
const profileCache = {
  data: null,
  lastFetch: 0,
  ttl: 300000, // 5 minutos en ms
};

export const useSendVerifyCode = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { showToast } = useToast();

  const sendCode = useCallback(
    async (email) => {
      setLoading(true);
      setError(null);
      try {
        const data = { type_email: '2', new_email: email };
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
    },
    [showToast],
  );

  const verify = useCallback(
    async (code) => {
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
    },
    [showToast],
  );

  const updateEmail = useCallback(
    async (email) => {
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
    },
    [showToast],
  );

  return { sendCode, verify, updateEmail, loading, error };
};

export const useProfile = () => {
  const [profile, setProfile] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { showToast } = useToast();

  const fetchProfile = useCallback(
    async (force = false) => {
      // Usar caché si está disponible y no está expirado
      const now = Date.now();
      if (
        !force &&
        profileCache.data &&
        now - profileCache.lastFetch < profileCache.ttl
      ) {
        setProfile(profileCache.data.profile);
        setPhoto(profileCache.data.photo);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const [profileData, photoData] = await Promise.allSettled([
          getProfile(),
          getPhoto(),
        ]);

        const profileResult =
          profileData.status === 'fulfilled' ? profileData.value : null;
        const photoResult =
          photoData.status === 'fulfilled'
            ? URL.createObjectURL(photoData.value)
            : '/src/assets/Img/MiniLogoReflexo.webp';

        // Actualizar caché
        profileCache.data = {
          profile: profileResult,
          photo: photoResult,
        };
        profileCache.lastFetch = now;

        setProfile(profileResult);
        setPhoto(photoResult);
      } catch (error) {
        setError(error);
        showToast('error', 'Error al cargar el perfil');
      } finally {
        setLoading(false);
      }
    },
    [showToast],
  );

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return { profile, photo, loading, error, refetch: fetchProfile };
};

export const useUpdateProfile = () => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateError, setUpdateError] = useState(null);
  const { showToast } = useToast();

  const updateProfile = useCallback(
    async (data) => {
      try {
        setIsUpdating(true);
        setUpdateError(null);
        const updatedProfile = await updateAllProfile(data);
        // Invalidar caché después de actualización
        profileCache.lastFetch = 0;
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
    },
    [showToast],
  );

  const validateCurrentPassword = useCallback(
    async (currentPassword) => {
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
    },
    [showToast],
  );

  const updatePassword = useCallback(
    async (newPassword) => {
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
    },
    [showToast],
  );

  const uploadProfilePhoto = useCallback(
    async (file) => {
      try {
        const formData = new FormData();
        formData.append('photo', file);
        const response = await uploadPhoto(formData);
        // Invalidar caché de foto
        profileCache.lastFetch = 0;
        showToast('exito', 'Foto de perfil actualizada');
        return response;
      } catch (error) {
        showToast('error', 'Error al subir la foto de perfil');
        throw error;
      }
    },
    [showToast],
  );

  return {
    updateProfile,
    validateCurrentPassword,
    updatePassword,
    uploadProfilePhoto,
    isUpdating,
    error: updateError,
  };
};
