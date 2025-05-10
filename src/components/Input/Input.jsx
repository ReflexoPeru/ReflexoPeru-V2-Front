import { DatePicker, Input, Select } from 'antd';

const { Option } = Select;

const inputStyle = {
  backgroundColor: '#444444',
  color: '#FFFFFFFF',
  borderColor: '#444',
  borderRadius: '8px', // Agregar borde redondeado
};

const dropdownStyle = {
  backgroundColor: '#444444',
  color: '#FFFFFFFF',
};

const InputField = ({ type, label, options = [], ...rest }) => {
  switch (type) {
    case 'select':
      return (
        <Select
          style={inputStyle}
          dropdownStyle={dropdownStyle}
          {...rest}
        >
          {options.map((opt) => (
            <Option key={opt.value} value={opt.value} style={{ color: '#ffffff' }}>
              {opt.label}
            </Option>
          ))}
        </Select>
      );
    case 'date':
      return <DatePicker style={inputStyle} {...rest} />;
    default:
      return <Input style={inputStyle} {...rest} />;
  }
};

export default InputField;
