import React from "react";
import { Pagination } from "antd";
import { useTheme } from "../../../context/ThemeContext";
import "./Pagination.module.css";

const ModeloPagination = ({ total, current, pageSize, onChange }) => {
    const { isDarkMode } = useTheme();
    
    const handleChange = (page, size) => {
        onChange(page, size);
    };
    
    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column', 
                alignItems: 'flex-end',
                marginTop: '16px',
            }}
        >
            <div
                style={{
                    background: isDarkMode ? '#2a2a2a' : '#ffffff',
                    padding: '4px 8px',
                    borderRadius: '8px',
                    display: 'inline-block',
                    border: `1px solid ${isDarkMode ? '#444444' : '#e0e0e0'}`,
                    boxShadow: isDarkMode 
                        ? '0 2px 8px rgba(0, 0, 0, 0.2)' 
                        : '0 2px 8px rgba(0, 0, 0, 0.08)',
                    transition: 'all 0.3s ease'
                }}
            >
                <Pagination
                    showSizeChanger={false}
                    current={current}
                    total={total}
                    pageSize={pageSize}
                    onChange={handleChange}
                    style={{
                        margin: 0
                    }}
                />
            </div>
            <div 
                style={{ 
                    color: isDarkMode ? '#9CA3AF' : '#666666', 
                    marginTop: '8px',
                    fontFamily: 'Poppins, sans-serif',
                    fontSize: '12px',
                    fontWeight: '400'
                }}
            >
                {pageSize} / página
            </div>
        </div>
    );
};

export default ModeloPagination;