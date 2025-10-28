import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { initializeParticles } from '../../../../hooks/loginpacticles';
import { useToast } from '../../../../services/toastify/ToastContext';
import {
  sendForgotPasswordCode,
  verifyForgotPasswordCode,
  resetForgotPassword,
} from '../../service/authService';
import SendCode from './SendCode';
import VerifyCode from './VerifyCode';
import NewPassword from './NewPassword';
import SuccessModal from './SuccessModal';
import styles from './ForgotPassword.module.css';

function ForgotPassword() {
  const navigate = useNavigate();
  const { showToast } = useToast();

  // Estados del flujo
  const [step, setStep] = useState(1); // 1: SendCode, 2: VerifyCode, 3: NewPassword, 4: Success
  const [userId, setUserId] = useState(null);
  const [code, setCode] = useState('');
  const [email, setEmail] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  useEffect(() => {
    const cleanup = initializeParticles();
    return cleanup;
  }, []);

  // Función helper para obtener mensaje de error amigable
  const getErrorMessage = (error) => {
    if (!error.response) {
      return 'No se pudo conectar con el servidor. Verifica tu conexión a internet.';
    }

    const status = error.response.status;
    const backendMessage = error.response.data?.message || '';

    switch (status) {
      case 400:
        if (backendMessage.includes('inválido') || backendMessage.includes('expirado')) {
          return 'El código de verificación es inválido o ha expirado. Por favor solicita uno nuevo.';
        }
        return backendMessage || 'Solicitud inválida. Por favor verifica los datos ingresados.';
      
      case 404:
        if (backendMessage.includes('correo')) {
          return 'No se encontró un usuario con ese correo electrónico.';
        }
        if (backendMessage.includes('usuario')) {
          return 'Usuario no encontrado.';
        }
        return 'Recurso no encontrado.';
      
      case 422:
        const errors = error.response.data?.errors;
        if (errors) {
          const errorMessages = Object.values(errors).flat();
          return errorMessages.join(' ');
        }
        return backendMessage || 'Datos inválidos. Por favor verifica la información ingresada.';
      
      case 500:
        return 'Error del servidor. Por favor intenta más tarde o contacta al administrador.';
      
      default:
        return backendMessage || 'Ocurrió un error inesperado. Por favor intenta de nuevo.';
    }
  };

  // Paso 1: Solicitar código
  const handleSendCode = async (emailValue) => {
    try {
      showToast('informacion', 'Enviando código de verificación...');
      const response = await sendForgotPasswordCode(emailValue);
      if (response.data?.status) {
        setUserId(response.data.user_id);
        setEmail(emailValue);
        setStep(2);
        showToast('success', response.data.message || 'Se ha enviado un código de verificación a tu correo electrónico');
      }
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      showToast('error', errorMessage);
    }
  };

  // Paso 2: Verificar código
  const handleVerifyCode = async (codeValue) => {
    try {
      showToast('informacion', 'Verificando código...');
      const response = await verifyForgotPasswordCode(userId, codeValue);
      if (response.data?.status) {
        setCode(codeValue);
        setStep(3);
        showToast('success', response.data.message || 'Código verificado correctamente');
      }
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      showToast('error', errorMessage);
    }
  };

  // Reenviar código
  const handleResendCode = async () => {
    try {
      showToast('informacion', 'Reenviando código de verificación...');
      const response = await sendForgotPasswordCode(email);
      if (response.data?.status) {
        showToast('success', 'Se ha enviado un nuevo código de verificación a tu correo electrónico');
      }
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      showToast('error', errorMessage);
    }
  };

  // Paso 3: Restablecer contraseña
  const handleResetPassword = async (password, passwordConfirmation) => {
    try {
      showToast('informacion', 'Restableciendo contraseña...');
      const response = await resetForgotPassword(userId, code, password, passwordConfirmation);
      if (response.data?.status) {
        showToast('success', response.data.message || 'Tu contraseña ha sido restablecida exitosamente');
        setShowSuccessModal(true);
      }
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      showToast('error', errorMessage);
    }
  };

  const handleBackToLogin = () => {
    navigate('/');
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return <SendCode onSubmit={handleSendCode} />;
      case 2:
        return <VerifyCode onSubmit={handleVerifyCode} onResend={handleResendCode} email={email} />;
      case 3:
        return <NewPassword onSubmit={handleResetPassword} email={email} />;
      default:
        return <SendCode onSubmit={handleSendCode} />;
    }
  };

  return (
    <div>
      <div id="particles-js" className={styles.particlesJs}></div>
      
      {!showSuccessModal && (
        <div className={styles.loginContainer}>
          <div className={styles.loginForm}>
            {renderStep()}
            
            <div className={styles.backToLogin}>
              <button
                type="button"
                onClick={() => navigate('/')}
                className={styles.backButton}
              >
                ← Volver al inicio de sesión
              </button>
            </div>
          </div>
        </div>
      )}
      
      {showSuccessModal && <SuccessModal onBackToLogin={handleBackToLogin} />}
      
      {!showSuccessModal && (
        <div className={styles.footer}>
          © 2025 Centro de Reflexoterapia - Todos los derechos reservados
        </div>
      )}
    </div>
  );
}

export default ForgotPassword;

