import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Select, Upload, Button, message, Typography } from 'antd';
import { UploadOutlined, FileImageOutlined } from '@ant-design/icons';
import CustomButton from '../../../../../components/Button/CustomButton';
import { compressImage } from '../../../../../utils/imageUtils';

const { TextArea } = Input;
const { Text } = Typography;

export default function ReportFormModal({ visible, onCancel, onSubmit, initialValues, loading }) {
    const [form] = Form.useForm();
    const [fileList, setFileList] = useState([]);
    const [isCompressing, setIsCompressing] = useState(false);

    useEffect(() => {
        if (visible && initialValues) {
            form.setFieldsValue(initialValues);
            setFileList([]);
        } else if (visible) {
            form.resetFields();
            setFileList([]);
        }
    }, [visible, initialValues, form]);

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();
            const formData = new FormData();

            formData.append('title', values.title);
            formData.append('description', values.description);
            formData.append('type', values.type || 'other');
            formData.append('priority', values.priority || 'medium');

            if (fileList.length > 0) {
                setIsCompressing(true);
                const hide = message.loading('Comprimiendo imágenes...', 0);

                try {
                    for (let i = 0; i < fileList.length; i++) {
                        const file = fileList[i].originFileObj || fileList[i];
                        try {
                            const compressedFile = await compressImage(file, { quality: 0.7 });
                            formData.append('images[]', compressedFile);
                        } catch (compressError) {
                            console.error(`Error compressing image ${i}:`, compressError);
                            formData.append('images[]', file); // Fallback to original
                        }
                    }
                    hide();
                    message.success('Imágenes procesadas correctamente');
                } catch (err) {
                    hide();
                    message.error('Error al procesar algunas imágenes');
                } finally {
                    setIsCompressing(false);
                }
            }

            if (initialValues?.id) {
                formData.append('_method', 'PATCH');
            }

            await onSubmit(formData);
            form.resetFields();
            setFileList([]);
        } catch (error) {
            console.error('Validation failed:', error);
        }
    };

    const uploadProps = {
        onRemove: (file) => {
            const index = fileList.indexOf(file);
            const newFileList = fileList.slice();
            newFileList.splice(index, 1);
            setFileList(newFileList);
        },
        beforeUpload: (file) => {
            const isLt2M = file.size / 1024 / 1024 < 2;
            if (!isLt2M) {
                message.error(`${file.name} es demasiado grande. Máximo 2MB.`);
                return Upload.LIST_IGNORE;
            }
            const isImage = file.type.startsWith('image/');
            if (!isImage) {
                message.error(`${file.name} no es una imagen válida.`);
                return Upload.LIST_IGNORE;
            }
            setFileList(prev => [...prev, file]);
            return false;
        },
        fileList,
    };

    return (
        <Modal
            title={initialValues ? 'Editar Reporte' : 'Nuevo Reporte de Ayuda'}
            open={visible}
            onCancel={onCancel}
            footer={(
                <div style={{ padding: '0 16px 16px 16px', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                    <Button key="back" onClick={onCancel} disabled={loading || isCompressing} style={{ borderRadius: '8px', height: '40px' }}>
                        Cancelar
                    </Button>
                    <CustomButton
                        key="submit"
                        text={isCompressing ? 'Procesando...' : (initialValues ? 'Actualizar' : 'Enviar Reporte')}
                        onClick={handleSubmit}
                        loading={loading || isCompressing}
                        disabled={isCompressing}
                        style={{ display: 'inline-flex', height: '40px', borderRadius: '8px' }}
                    />
                </div>
            )}
            width={650}
            centered
            styles={{
                header: { borderBottom: '1px solid #f0f0f0', paddingBottom: '20px', marginBottom: '24px' },
                footer: { borderTop: 'none', padding: 0 }
            }}
        >
            <Form
                form={form}
                layout="vertical"
                initialValues={{
                    type: 'error',
                    priority: 'medium'
                }}
            >
                <Form.Item
                    name="title"
                    label={<Text strong>Título del Reporte</Text>}
                    rules={[{ required: true, message: 'Por favor ingresa un título' }]}
                >
                    <Input placeholder="Ej: Error al guardar paciente" size="large" style={{ borderRadius: '10px' }} />
                </Form.Item>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    <Form.Item
                        name="type"
                        label={<Text strong>Tipo de Reporte</Text>}
                        rules={[{ required: true }]}
                    >
                        <Select size="large" style={{ borderRadius: '10px' }}>
                            <Select.Option value="error">Error / Fallo</Select.Option>
                            <Select.Option value="suggestion">Sugerencia</Select.Option>
                            <Select.Option value="support">Soporte Técnico</Select.Option>
                            <Select.Option value="other">Otro</Select.Option>
                        </Select>
                    </Form.Item>

                    <Form.Item
                        name="priority"
                        label={<Text strong>Prioridad</Text>}
                        rules={[{ required: true }]}
                    >
                        <Select size="large" style={{ borderRadius: '10px' }}>
                            <Select.Option value="low">Baja</Select.Option>
                            <Select.Option value="medium">Media</Select.Option>
                            <Select.Option value="high">Alta</Select.Option>
                        </Select>
                    </Form.Item>
                </div>

                <Form.Item
                    name="description"
                    label={<Text strong>Descripción detallada</Text>}
                    rules={[{ required: true, message: 'Por favor explica lo sucedido' }]}
                >
                    <TextArea
                        rows={18}
                        placeholder="Describe los pasos para reproducir el error o los detalles de tu sugerencia con el mayor detalle posible..."
                        style={{ borderRadius: '12px', padding: '12px', minHeight: '300px' }}
                    />
                </Form.Item>

                <Form.Item label="Capturas de pantalla (Opcional)">
                    <Upload
                        {...uploadProps}
                        maxCount={5}
                        multiple
                        listType="picture"
                        accept="image/png, image/jpeg, image/jpg, image/gif"
                    >
                        <Button icon={<UploadOutlined />} disabled={isCompressing}>Seleccionar Imágenes</Button>
                    </Upload>
                    <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginTop: '8px' }}>
                        Máximo 5 imágenes. Formatos: JPG, PNG, GIF. Máx 2MB c/u. Se comprimirán automáticamente.
                    </p>
                </Form.Item>
            </Form>
        </Modal>
    );
}
