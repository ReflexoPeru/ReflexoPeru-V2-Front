import { Select, Spin } from 'antd';
import { useEffect, useState } from 'react';
import { getDiuTypes } from './SelectsApi';

const { Option } = Select;

const SelectDiuType = ({ value, onChange, placeholder = 'Seleccione tipo de DIU', allowClear = true, className = '', disabled = false }) => {
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    getDiuTypes()
      .then((data) => {
        if (mounted) setOptions(data);
      })
      .finally(() => mounted && setLoading(false));
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <Select
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      allowClear={allowClear}
      className={className}
      loading={loading}
      notFoundContent={loading ? <Spin size="small" /> : null}
      disabled={disabled}
      style={{ minWidth: 215, width: 275 }}
    >
      {options.map((opt) => (
        <Option key={opt.value} value={opt.value}>{opt.label}</Option>
      ))}
    </Select>
  );
};

export default SelectDiuType;


