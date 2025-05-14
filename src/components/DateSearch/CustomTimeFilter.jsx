import React from "react";
import { DatePicker, ConfigProvider } from "antd";
import es_ES from "antd/lib/locale/es_ES"; // Locale en español


const CustomTimeFilter = ({
    onChange,
    size = "large",
    style = {},
    format = "DD/MM/YYYY", 
}) => {
    return (
    <ConfigProvider
        locale={es_ES}
        theme={{
            components: {
                DatePicker: {
                    colorTextPlaceholder: "#AAAAAA",
                    colorBgContainer: "#333333",
                    colorText: "#FFFFFF",
                    colorBorder: "#444444",
                    borderRadius: 4,
                    hoverBorderColor: "#555555",
                    activeBorderColor: "#00AA55",
                    colorIcon: "#FFFFFF",
                    colorIconHover:'#00AA55',
                    colorBgElevated: '#121212',
                    colorPrimary: '#00AA55',
                    colorTextDisabled: '#333333',
                    colorTextHeading:'#FFFFFF',
                    cellHoverBg:'#00AA55',
                    colorSplit:'#444444',
                },
            },
        }}
    >
        <DatePicker
                size={size}
                onChange={onChange}
                format={format}
                style={{
                    width: '200px',
                    boxShadow: "none",
                    ...style,
                }}
                placeholder="Filtrar fecha"
            />
        </ConfigProvider>
    );
};

export default CustomTimeFilter;
