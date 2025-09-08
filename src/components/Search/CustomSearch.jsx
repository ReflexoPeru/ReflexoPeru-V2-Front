import React from "react";
import { Input } from "antd";

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


    return (
        <Input
            placeholder={placeholder}
            size={size}
            onChange={handleChange} 
            style={{ 
            width,
            boxShadow: "none",
            ...style 
            }}
        />
    );
};

export default CustomSearch;