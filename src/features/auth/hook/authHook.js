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
import { useUser } from '../../../context/UserContext';
import { useCompany } from '../../../context/CompanyContext';
import { get } from '../../../services/api/Axios/MethodsGeneral';

export const useAuth = () => {
  const { showToast } = useToast();
  const { setIsAuthenticated, setUserRole } = useAuthentication();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { refetchPhoto, refetchProfile } = useUser();
  const { refetchCompanyLogo, refetchCompanyInfo } = useCompany();

  // Función helper para traducir mensajes del backend al español
  const translateMessage = (message) => {
    if (!message) return null;
    
    const translations = {
      'These credentials do not match our records.': 'Las credenciales no coinciden con nuestros registros.',
      'The selected email is invalid.': 'El correo electrónico seleccionado no es válido.',
      'The selected email does not exist.': 'No se encontró un usuario con ese correo electrónico.',
      'The email must be a valid email address.': 'Debe ser una dirección de correo electrónico válida.',
      'The password field is required.': 'El campo de contraseña es requerido.',
      'The email field is required.': 'El campo de correo electrónico es requerido.',
    };

    return translations[message] || message;
  };

  const fetchUserRole = async () => {
    try {
      const res = await get('get-role');
      if (res.data) {
        setUserRole(res.data.role_id);
        persistLocalStorage('user_role', res.data.role_id);
        persistLocalStorage('name', res.data.name);
        persistLocalStorage('user_id', res.data.user_id);
        return true;
      }
      return false;
    } catch (err) {
      showToast(
        'intentoFallido',
        'No se pudo obtener la información del usuario.',
      );
      return false;
    }
  };

  const login = async (credentials) => {
    setLoading(true);
    try {
      const loginData = await LoginService(credentials);

      if (loginData.status === 200 && loginData.data) {
        if (loginData.data.first_login) {
          persistLocalStorage('user_id', loginData.data.user_id);
          showToast('inicioSesionExitoso');
          navigate('/primerInicio');
        } else {
          persistLocalStorage('token', loginData.data.token);
          setIsAuthenticated(true);

          const roleFetched = await fetchUserRole();

          if (roleFetched) {
            navigate('/Inicio');
            showToast('inicioSesionExitoso');

            (async () => {
              await refetchPhoto();
              await refetchCompanyLogo();
              await refetchProfile();
              await refetchCompanyInfo();
            })();
          } else {
            removeLocalStorage('token');
            setIsAuthenticated(false);
          }
        }
      }
    } catch (error) {
      const backendMsg = error?.response?.data?.message || null;
      showToast('intentoFallido', translateMessage(backendMsg));
    } finally {
      setLoading(false);
    }
  };

  const logOut = async () => {
    try {
      await LogOutService();
      showToast('cierreSesion');
    } catch (error) {
    } finally {
      removeLocalStorage('token');
      removeLocalStorage('user_id');
      removeLocalStorage('name');
      removeLocalStorage('user_role');
      setIsAuthenticated(false);
      setUserRole(null);
      navigate('/');
      setTimeout(() => {
        window.location.reload();
      }, 500);
    }
  };

  const validateCode = async (code) => {
    try {
      const data = await validateCodeService(code, getLocalStorage('user_id'));
      if (data.data?.valid) {
        showToast('codigoVerificado');
        persistLocalStorage('token', data.data.token);
        navigate('/cambiarContraseña');
      } else {
        showToast('intentoFallido', translateMessage(data.data?.message) || 'Código incorrecto');
      }
    } catch (error) {
      const backendMsg = error?.response?.data?.message || null;
      showToast('intentoFallido', translateMessage(backendMsg));
    }
  };

  const changePassword = async (data) => {
    try {
      const response = await changePasswordService(data);
      if (response.status == '200') {
        showToast('contraseñaCambiada');
        setIsAuthenticated(true);
        const roleFetched = await fetchUserRole();
        if (roleFetched) {
          navigate('/Inicio');
          (async () => {
            await refetchPhoto();
            await refetchCompanyLogo();
            await refetchProfile();
            await refetchCompanyInfo();
          })();
        }
      } else {
        showToast('intentoFallido');
      }
    } catch (error) {
      const backendMsg = error?.response?.data?.message || null;
      showToast('intentoFallido', translateMessage(backendMsg));
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
      showToast('intentoFallido', translateMessage(backendMsg));
    }
  };

  return {
    login,
    loading,
    logOut,
    validateCode,
    changePassword,
    sendVerifyCode,
  };
};
