// components/Input/Input.jsx
import { CheckCircleFilled } from '@ant-design/icons';
import { DatePicker, Input, Select } from 'antd';
import styles from './Input.module.css';

const { Option } = Select;

const InputField = ({
  type,
  label,
  options = [],
  isPhoneField = false,
  isPhoneRequired,
  togglePhoneRequired,
  ...rest
}) => {
  let inputComponent;

  const inputProps = {
    className: styles.inputStyle,
    ...rest,
  };

  switch (type) {
    case 'select':
      inputComponent = (
        <Select
          {...inputProps}
          dropdownStyle={{ backgroundColor: '#444444', color: '#FFFFFF' }}
        >
          {options.map((opt) => (
            <Option key={opt.value} value={opt.value} style={{ color: '#fff' }}>
              {opt.label}
            </Option>
          ))}
        </Select>
      );
      break;

    case 'date':
      inputComponent = <DatePicker {...inputProps} />;
      break;

    case 'textarea':
      inputComponent = <Input.TextArea rows={4} {...inputProps} />;
      break;

    case 'number':
      inputComponent = <Input type="number" {...inputProps} />;
      break;

    case 'email':
      inputComponent = <Input type="email" {...inputProps} />;
      break;

    case 'password':
      inputComponent = <Input.Password {...inputProps} />;
      break;

    default:
      inputComponent = <Input {...inputProps} />;
      break;
  }

  if (isPhoneField) {
    return (
      <div className={styles.inputWrapper}>
        {inputComponent}
        <CheckCircleFilled
          onClick={togglePhoneRequired}
          title={
            isPhoneRequired
              ? 'Teléfono obligatorio (clic para hacerlo opcional)'
              : 'Teléfono opcional (clic para hacerlo obligatorio)'
          }
          className={styles.icon}
          style={{ color: isPhoneRequired ? '#FFF' : '#aaa' }}
        />
      </div>
    );
  }

  return inputComponent;
};

export default InputField;
