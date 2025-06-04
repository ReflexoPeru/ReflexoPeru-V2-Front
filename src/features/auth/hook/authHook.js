import {
  login as LoginService,
  logOut as LogOutService,
  validateCode as validateCodeService,
  changePassword as changePasswordService,
  sendVerifyCode as sendVerifyCodeService,
} from '../service/authService';
import { useNavigate } from 'react-router';
import { useState } from 'react';
import { useToast } from '../../../services/toastify/ToastContext';
import {
  getLocalStorage,
  persistLocalStorage,
  removeLocalStorage,
} from '../../../utils/localStorageUtility';
import { useAuth as useAuthentication } from '../../../routes/AuthContext';
import { get } from '../../../services/api/Axios/MethodsGeneral';

export const useAuth = () => {
  const { showToast } = useToast();
  const { setIsAuthenticated, setUserRole } = useAuthentication();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchUserData = async () => {
    try {
      const res = await get('get-role');
      if (res.data) {
        setIsAuthenticated(true);
        setUserRole(res.data.role_id);
        persistLocalStorage('name', res.data.name);
        persistLocalStorage('user_id', res.data.user_id);
        return true;
      }
    } catch (err) {
      showToast('intentoFallido', err?.response?.data?.message);
      return false;
    }
  };

  const login = async (credentials) => {
    try {
      setLoading(true);
      const data = await LoginService(credentials);
      if (data.status == '200') {
        if (data.data.first_login) {
          persistLocalStorage('user_id', data.data.user_id);
          showToast('inicioSesionExitoso');
          navigate('/primerInicio');
        } else {
          showToast('inicioSesionExitoso');
          persistLocalStorage('token', data.data.token);
          removeLocalStorage('user_id');

          // Obtener los datos del usuario después del login
          const userDataFetched = await fetchUserData();
          if (userDataFetched) {
            navigate('/Inicio');
          } else {
            removeLocalStorage('token');
            setIsAuthenticated(false);
            setUserRole(null);
          }
        }
      }
    } catch (error) {
      const backendMsg = error?.response?.data?.message || null;
      showToast('intentoFallido', backendMsg);
    } finally {
      setLoading(false);
    }
  };

  const validateCode = async (code) => {
    try {
      const data = await validateCodeService(code, getLocalStorage('user_id'));
      console.log(data);
      if (data.status == '200') {
        showToast('codigoVerificado');
        persistLocalStorage('token', data.data.token);
        navigate('/cambiarContraseña');
      } else {
        showToast('codigoIncorrecto');
      }
    } catch (error) {
      const backendMsg = error?.response?.data?.message || null;
      showToast('intentoFallido', backendMsg);
    }
  };

  const changePassword = async (data) => {
    try {
      const response = await changePasswordService(data);
      if (response.status == '200') {
        showToast('contraseñaCambiada');
        navigate('/Inicio');
      } else {
        showToast('intentoFallido');
      }
    } catch (error) {
      const backendMsg = error?.response?.data?.message || null;
      showToast('intentoFallido', backendMsg);
    }
  };

  const logOut = async () => {
    try {
      const response = await LogOutService();
      if (response.status == '200') {
        showToast('cierreSesion');
        removeLocalStorage('token');
        removeLocalStorage('user_id');
        removeLocalStorage('name');
        setIsAuthenticated(false);
        setUserRole(null);
        navigate('/');
      } else {
        showToast('intentoFallido');
      }
    } catch (error) {
      const backendMsg = error?.response?.data?.message || null;
      showToast('intentoFallido', backendMsg);
    }
  };

  const sendVerifyCode = async () => {
    try {
      const response = await sendVerifyCodeService(getLocalStorage('user_id'));
      if (response.status == '200') {
        showToast('codigoEnviado');
      } else {
        showToast('intentoFallido');
      }
    } catch (error) {
      const backendMsg = error?.response?.data?.message || null;
      showToast('intentoFallido', backendMsg);
    }
  };

  return {
    login,
    loading,
    error,
    validateCode,
    changePassword,
    logOut,
    sendVerifyCode,
  };
};
