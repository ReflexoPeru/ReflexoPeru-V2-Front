import { useState, useEffect } from 'react';
import {
  createPatient,
  verifyCode,
  updateProfileEmail,
  getProfile,
  updateAllProfile,
} from '../service/profileService';
import { set } from 'date-fns';

export const useSendVerifyCode = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const data = await getProfile();
      setProfile(data);
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
    setProfile,
    loading,
    error,
    refetch: fetchProfile,
  }


}

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

  return {
    updateProfile,
    isUpdating,
    error: updateError,
  };
};