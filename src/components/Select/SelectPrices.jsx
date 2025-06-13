// Select/SelectPrices.jsx
import { ConfigProvider, Input, Select } from 'antd';
import { useEffect, useState } from 'react';
import styles from '../Input/Input.module.css';
import { getPredeterminedPrices } from './SelectsApi';

const { Option } = Select;

const SelectPrices = ({ onChange, value, ...rest }) => {
  const [prices, setPrices] = useState([]);
  const [selectedPrice, setSelectedPrice] = useState('');

  useEffect(() => {
    const fetchPrices = async () => {
      const priceOptions = await getPredeterminedPrices();
      setPrices(priceOptions);
    };

    fetchPrices();
  }, []);

  const handleSelectChange = (value) => {
    const selected = prices.find(item => item.value === value);
    setSelectedPrice(selected?.price || '');
    
    if (onChange) {
      onChange(value);
    }
  };

    return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}>
        <ConfigProvider
        theme={{
            components: {
            Select: {
                colorPrimary: '#1677ff',
                optionSelectedBg: '#333333',
                colorText: '#fff',
                colorBgElevated: '#444444',
                colorTextPlaceholder: '#aaa',
                controlItemBgHover: '#444444',
                selectorBg: '#444444',
            },
            },
            token: {
            colorTextBase: '#fff',
            },
        }}
        >
        <Select
            className={styles.inputStyle}
            dropdownStyle={{ backgroundColor: '#444444', color: '#fff' }}
            style={{ color: '#fff', backgroundColor: '#1a1a1a' }}
            onChange={handleSelectChange}
            value={value}
            {...rest}
        >
            {prices.map((item) => (
            <Option key={item.value} value={item.value} style={{ color: '#fff' }}>
                {item.label}
            </Option>
            ))}
        </Select>
        </ConfigProvider>

        <Input
          className={styles.inputStyle}
          value={selectedPrice}
          readOnly
          prefix="S/"
          style={{
            height: '35px',
            lineHeight: '40px',     // Alineación vertical del texto
            paddingTop: '0px',      // Opcional: evita desalineación extra
            paddingBottom: '0px',   // Opcional: evita desalineación extra
            marginBottom: '-50px',
            display: 'flex',
            alignItems: 'center',
          }}
        />
    </div>
    );
};

export default SelectPrices;