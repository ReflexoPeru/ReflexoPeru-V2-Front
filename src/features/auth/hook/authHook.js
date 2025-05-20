import {
  login as LoginService,
  logOut as LogOutService,
  validateCode as validateCodeService,
  changePassword as changePasswordService,
} from '../service/authService';
import { useNavigate } from 'react-router';
import { useState } from 'react';
import { useToast } from '../../../services/toastify/ToastContext';

export const useAuth = () => {
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = async (credentials) => {
    try {
      const data = await LoginService(credentials);
      if (data.status == '200') {
        if (data.data.first_login) {
          localStorage.setItem('user_id', data.data.user_id);
          showToast('inicioSesionExitoso');
          navigate('/primerInicio');
        } else {
          showToast('inicioSesionExitoso');
          localStorage.setItem('token', data.data.token);
          localStorage.removeItem('user_id');
          navigate('/Inicio');
        }
      }
    } catch {
      showToast('intentoFallido');
    }
  };

  const validateCode = async (code) => {
    try {
      const data = await validateCodeService(
        code,
        localStorage.getItem('user_id'),
      );
      console.log(data);
      if (data.status == '200') {
        showToast('codigoVerificado');
        localStorage.setItem('token', data.data.token);
        navigate('/cambiarContraseña');
      } else if (data.status == '401') {
        showToast('codigoIncorrecto');
      }
    } catch {
      showToast('codigoIncorrecto');
    }
  };

  const changePassword = async (data) => {
    try {
      const response = await changePasswordService(data);
      console.log(response);
      if (response.status == '200') {
        showToast('contraseñaCambiada');
        navigate('/Inicio');
      } else if (data.status == '401') {
        showToast('intentoFallido');
      }
    } catch {
      showToast('contraseñaIncorrecta');
    }
  };

  return { login, loading, error, validateCode, changePassword };
};
