import { ConfigProvider, Input } from "antd";
import React from "react";
import { useTheme } from '../../context/ThemeContext';

const CustomSearch = ({
    placeholder = "Buscar...",  
    onSearch,                      
    size = "large",
    width = "400px",          
    style = {},               
}) => {
    const handleChange = (e) => {
        onSearch(e.target.value);
    };

    const { theme } = useTheme();
    const inputTheme = theme === 'dark'
        ? {
            colorTextPlaceholder: '#AAAAAA',
            colorBgContainer: '#333333',
            colorText: '#FFFFFF',
            colorBorder: '#444444',
            borderRadius: 4,
            hoverBorderColor: '#555555',
            activeBorderColor: '#00AA55',
        }
        : {
            colorTextPlaceholder: '#444444',
            colorBgContainer: '#fff',
            colorText: '#1A1A1A',
            colorBorder: '#CCCCCC',
            borderRadius: 4,
            hoverBorderColor: '#4CAF50',
            activeBorderColor: '#4CAF50',
        };

    return (
        <ConfigProvider
        theme={{
            components: {
            Input: inputTheme,
            },
        }}
        >
        <Input
            placeholder={placeholder}
            size={size}
            onChange={handleChange} 
            style={{ 
            width,
            boxShadow: "none",
            background: theme === 'light' ? '#fff' : '#333',
            color: theme === 'light' ? '#1A1A1A' : '#fff',
            ...style 
            }}
        />
        </ConfigProvider>
    );
};

export default CustomSearch;