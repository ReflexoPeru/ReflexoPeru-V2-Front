import { useState } from 'react';
import {
  createPatient,
  verifyCode,
  updateProfileEmail,
} from '../service/profileService';

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
