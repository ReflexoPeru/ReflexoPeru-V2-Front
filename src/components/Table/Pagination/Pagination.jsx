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
                flexDirection: 'row', 
                alignItems: 'center',
                justifyContent: 'space-between',
                marginTop: '12px',
                padding: '0 4px',
                width: '100%'
            }}
        >
            <div 
                style={{ 
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    color: isDarkMode ? '#9CA3AF' : '#64748b', 
                    fontFamily: "'Poppins', sans-serif",
                    fontSize: '13px',
                }}
            >
                <div style={{
                    backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : '#f1f5f9',
                    padding: '4px 12px',
                    borderRadius: '20px',
                    border: `1px solid ${isDarkMode ? '#444' : '#e2e8f0'}`,
                    fontWeight: '500'
                }}>
                    <span style={{ color: isDarkMode ? '#fff' : '#1e293b' }}>{pageSize}</span> por página
                </div>
                <div style={{ fontSize: '12px', opacity: 0.8 }}>
                    Total: <span style={{ fontWeight: '600' }}>{total}</span> registros
                </div>
            </div>

            <div
                style={{
                    background: isDarkMode ? '#1e1e1e' : '#ffffff',
                    padding: '4px 6px',
                    borderRadius: '12px',
                    border: isDarkMode ? '1px solid #333' : 'none',
                    boxShadow: isDarkMode 
                        ? '0 10px 15px -3px rgba(0, 0, 0, 0.4)' 
                        : '0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                    transition: 'all 0.3s ease'
                }}
            >
                <Pagination
                    showSizeChanger={false}
                    current={current}
                    total={total}
                    pageSize={pageSize}
                    onChange={handleChange}
                    size="small"
                    style={{
                        margin: 0
                    }}
                />
            </div>
        </div>
    );
};

export default ModeloPagination;