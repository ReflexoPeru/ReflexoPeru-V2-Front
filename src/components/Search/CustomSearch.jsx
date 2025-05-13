import React from "react";
import { Input, ConfigProvider } from "antd";

const { Search } = Input;

const CustomSearch = ({
    placeholder = "Buscar...",  
    onSearch,                 
    allowClear = true,        
    size = "large",
    width = "400px",          
    style = {},               
}) => {
    const handlePressEnter = (e) => {
        onSearch(e.target.value);
    };


    return (
        <ConfigProvider
        theme={{
            components: {
            Input: {
                colorTextPlaceholder: "#AAAAAA", 
                colorBgContainer: "#333333",    
                colorText: "#FFFFFF",           
                colorBorder: "#444444",         
                borderRadius: 4,                
                hoverBorderColor: "#555555",    
                activeBorderColor: "#00AA55",  
                colorIcon: "#AAAAAA", 
            },
            },
        }}
        >
        <Input
            placeholder={placeholder}
            allowClear={allowClear}
            size={size}
            onPressEnter={handlePressEnter}
            style={{ 
            width,
            boxShadow: "none",
            ...style 
            }}
        />
        </ConfigProvider>
    );
};

export default CustomSearch;