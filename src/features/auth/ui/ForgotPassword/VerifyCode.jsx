import React, { useState, useRef } from 'react';
import { Form, Input, Button } from 'antd';
import { ClockCounterClockwise } from '@phosphor-icons/react';
import styles from './ForgotPassword.module.css';
import logo from '../../../../assets/Img/Dashboard/MiniLogoReflexo.webp';

function VerifyCode({ onSubmit, onResend, email }) {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const inputRefs = useRef([]);

  const handleSubmit = async () => {
    const codeString = code.join('');
    setLoading(true);
    try {
      await onSubmit(codeString);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResendLoading(true);
    try {
      await onResend();
    } finally {
      setResendLoading(false);
    }
  };

  const handleChange = (index, value) => {
    if (value && !/^\d$/.test(value)) return;
    
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim().slice(0, 6);
    const newCode = [...code];
    for (let i = 0; i < pastedData.length; i++) {
      if (/^\d$/.test(pastedData[i])) {
        newCode[i] = pastedData[i];
      }
    }
    setCode(newCode);
    const nextIndex = Math.min(pastedData.length, 5);
    inputRefs.current[nextIndex]?.focus();
  };

  return (
    <>
      <img src={logo} className={styles.logo} alt="Logo" />
      <h2>Verificar Código</h2>
      <p className={styles.subtitle}>
        Ingresa el código de 6 dígitos que enviamos a:
        <br />
        <strong>{email}</strong>
      </p>
      <Form
        name="verify-code"
        onFinish={handleSubmit}
        layout="vertical"
      >
        <Form.Item
          name="code"
          rules={[
            { required: true, message: 'Por favor ingresa el código!' },
            { 
              validator: (_, value) => {
                const codeString = code.join('');
                if (codeString.length === 6) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('El código debe tener 6 dígitos!'));
              }
            },
          ]}
        >
          <div className={styles.inputContainer}>
            <div className={styles.otpContainer}>
              {code.map((digit, index) => (
                <Input
                  key={index}
                  ref={el => inputRefs.current[index] = el}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={handlePaste}
                  disabled={loading}
                  className={styles.otpInput}
                />
              ))}
            </div>
          </div>
        </Form.Item>

        <Form.Item className={styles.buttonContainer}>
          <Button
            type="primary"
            htmlType="submit"
            className={styles.submitButton}
            loading={loading}
            disabled={code.join('').length !== 6}
            block
          >
            {loading ? 'Verificando...' : 'Verificar Código'}
          </Button>
        </Form.Item>

        <div className={styles.resendContainer}>
          <Button
            type="link"
            onClick={handleResend}
            loading={resendLoading}
            className={styles.resendButton}
          >
            <ClockCounterClockwise size={20} />
            <span>Reenviar código</span>
          </Button>
        </div>
      </Form>
    </>
  );
}

export default VerifyCode;

