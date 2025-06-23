import { Cascader, ConfigProvider } from 'antd';
import { useEffect, useState, useCallback } from 'react';
import {
  getDepartaments,
  getDistricts,
  getProvinces,
} from '../Select/SelectsApi';

const SelectUbigeoCascader = ({ value, onChange, ...rest }) => {
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [internalValue, setInternalValue] = useState([]);

  // Carga los datos iniciales (departamentos) y reconstruye el árbol si hay un valor preseleccionado (modo edición)
  useEffect(() => {
    const initialize = async () => {
      setLoading(true);
      try {
        const departments = await getDepartaments();
        let initialOptions = departments.map((d) => ({
          label: d.name,
          value: String(d.id),
          isLeaf: false,
        }));

        if (
          value &&
          value.region_id &&
          value.province_id &&
          value.district_id
        ) {
          const [provinces, districts] = await Promise.all([
            getProvinces(value.region_id),
            getDistricts(value.province_id),
          ]);

          const regionName =
            departments.find((r) => String(r.id) === String(value.region_id))
              ?.name || '';
          const provinceName =
            provinces.find((p) => String(p.id) === String(value.province_id))
              ?.name || '';
          const districtName =
            districts.find((d) => String(d.id) === String(value.district_id))
              ?.name || '';

          // Reconstruir el nodo seleccionado para mostrarlo
          const regionNode = initialOptions.find(
            (o) => o.value === String(value.region_id),
          );
          if (regionNode) {
            regionNode.children = [
              {
                label: provinceName,
                value: String(value.province_id),
                isLeaf: false,
                children: [
                  {
                    label: districtName,
                    value: String(value.district_id),
                    isLeaf: true,
                  },
                ],
              },
            ];
          }
          setInternalValue([
            String(value.region_id),
            String(value.province_id),
            String(value.district_id),
          ]);
        }
        setOptions(initialOptions);
      } catch (error) {
        console.error('Error initializing Ubigeo Cascader:', error);
      } finally {
        setLoading(false);
      }
    };
    initialize();
  }, [value]);

  const loadData = useCallback(async (selectedOptions) => {
    const targetOption = selectedOptions[selectedOptions.length - 1];
    targetOption.loading = true;

    try {
      if (selectedOptions.length === 1) {
        const provinces = await getProvinces(targetOption.value);
        targetOption.children = provinces.map((p) => ({
          label: p.name,
          value: String(p.id),
          isLeaf: false,
        }));
      } else if (selectedOptions.length === 2) {
        const districts = await getDistricts(targetOption.value);
        targetOption.children = districts.map((d) => ({
          label: d.name,
          value: String(d.id),
          isLeaf: true,
        }));
      }
      setOptions((prevOptions) => [...prevOptions]);
    } catch (error) {
      console.error('Error loading dynamic data for Cascader:', error);
    } finally {
      targetOption.loading = false;
    }
  }, []);

  const handleChange = useCallback(
    (val) => {
      setInternalValue(val);
      if (onChange) {
        const ubigeoObject = {
          region_id: val[0] || null,
          province_id: val[1] || null,
          district_id: val[2] || null,
        };
        onChange(ubigeoObject);
      }
    },
    [onChange],
  );

  const filter = useCallback(
    (inputValue, path) =>
      path.some((option) =>
        option.label.toLowerCase().includes(inputValue.toLowerCase()),
      ),
    [],
  );

  return (
    <ConfigProvider
      theme={{
        components: {
          Cascader: {
            colorBgElevated: '#232323',
            colorText: '#fff',
            colorTextPlaceholder: '#aaa',
            colorTextDisabled: '#888',
            controlItemBgHover: '#333',
            colorPrimary: '#0066FF',
            colorBorder: '#444',
            colorIcon: '#fff',
            colorIconHover: '#0066FF',
            borderRadius: 10,
            controlHeight: 38,
            optionSelectedBg: '#222',
            optionActiveBg: '#333',
            colorScrollbarThumb: '#444',
            colorScrollbarTrack: '#232323',
            zIndexPopup: 2000,
          },
        },
        token: { colorTextBase: '#fff' },
      }}
    >
      <Cascader
        options={options}
        loadData={loadData}
        onChange={handleChange}
        changeOnSelect
        showSearch={{ filter }}
        placeholder="Seleccione departamento / provincia / distrito"
        style={{
          width: '100%',
          color: '#fff',
          background: '#232323',
          borderRadius: 10,
          border: '1px solid #444',
        }}
        dropdownStyle={{
          backgroundColor: '#232323',
          color: '#fff',
          borderRadius: 10,
          border: '1px solid #444',
        }}
        value={internalValue}
        disabled={loading}
        {...rest}
      />
      <style>{`
        .ant-cascader-menu { background: #232323 !important; color: #fff !important; border-radius: 10px !important; }
        .ant-cascader-menu-item { color: #fff !important; border-radius: 6px !important; }
        .ant-cascader-menu-item-active, .ant-cascader-menu-item:hover { background: #333 !important; color: #fff !important; }
        .ant-cascader-menu-item-disabled { color: #888 !important; }
        .ant-cascader-menu::-webkit-scrollbar { width: 8px; background: #232323; }
        .ant-cascader-menu::-webkit-scrollbar-thumb { background: #444; border-radius: 4px; }
      `}</style>
    </ConfigProvider>
  );
};

export default SelectUbigeoCascader;
