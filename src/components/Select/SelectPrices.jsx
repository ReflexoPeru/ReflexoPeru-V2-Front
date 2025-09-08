// Select/SelectPrices.jsx
import { Input, Select } from 'antd';
import { useEffect, useState } from 'react';
import styles from '../Input/Input.module.css';
import { getPredeterminedPrices } from './SelectsApi';

const { Option } = Select;

const SelectPrices = ({
  onChange,
  onPriceChange,
  value,
  initialPrice = '',
  ...rest
}) => {
  const [prices, setPrices] = useState([]);
  const [inputPrice, setInputPrice] = useState(initialPrice);

  useEffect(() => {
    const fetchPrices = async () => {
      const priceOptions = await getPredeterminedPrices();
      console.log('Loaded predetermined prices:', priceOptions);
      setPrices(priceOptions);
    };
    fetchPrices();
  }, []);

  // Si cambia el initialPrice desde el padre, actualizar el input
  useEffect(() => {
    setInputPrice(initialPrice);
  }, [initialPrice]);

  const handleSelectChange = (selectedValue) => {
    console.log('SelectPrices - Selected value:', selectedValue);
    const selected = prices.find((item) => item.value === selectedValue);
    console.log('SelectPrices - Selected item:', selected);
    const newPrice = selected?.price || '';
    setInputPrice(newPrice);
    if (onChange) onChange(selectedValue);
    if (onPriceChange) onPriceChange(newPrice);
  };

  const handleInputChange = (e) => {
    const newValue = e.target.value;
    setInputPrice(newValue);
    if (onPriceChange) onPriceChange(newValue);
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--spacing-xs)',
        width: '100%',
      }}
    >
      <Select
        className={styles.inputStyle}
        onChange={handleSelectChange}
        value={value}
        allowClear
        {...rest}
      >
        {prices.map((item) => (
          <Option
            key={item.value}
            value={item.value}
          >
            {item.label}
          </Option>
        ))}
      </Select>

      <Input
        className={styles.inputStyle}
        value={inputPrice}
        prefix="S/"
        onChange={handleInputChange}
        style={{
          height: 'var(--button-height-sm)',
          lineHeight: 'var(--button-height-md)',
          paddingTop: '0px',
          paddingBottom: '0px',
          marginBottom: '-50px',
          display: rest.hidePriceInput ? 'none' : 'flex',
          alignItems: 'center',
        }}
      />
    </div>
  );
};

export default SelectPrices;
