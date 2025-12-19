import React from 'react';
import { Modal, Form, Input, Button, Typography, Divider } from 'antd';
import CustomButton from '../../../../../components/Button/CustomButton';

const { TextArea } = Input;
const { Text, Title } = Typography;

export default function ResolveReportModal({ visible, onCancel, onResolve, loading, report }) {
    const [form] = Form.useForm();

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();
            await onResolve(report.id, { admin_comment: values.admin_comment });
            form.resetFields();
        } catch (error) {
            console.error('Validation failed:', error);
        }
    };

    return (
        <Modal
            title={<Title level={4} style={{ margin: 0 }}>Atender Reporte</Title>}
            open={visible}
            onCancel={onCancel}
            footer={(
                <div style={{ padding: '0 16px 16px 16px', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                    <Button key="back" onClick={onCancel} disabled={loading} style={{ borderRadius: '8px', height: '40px' }}>
                        Cancelar
                    </Button>
                    <CustomButton
                        key="submit"
                        text="Resolver y Archivar"
                        onClick={handleSubmit}
                        loading={loading}
                        style={{ display: 'inline-flex', height: '40px', borderRadius: '8px' }}
                    />
                </div>
            )}
            centered
            width={600}
            styles={{
                header: { borderBottom: '1px solid #f0f0f0', paddingBottom: '16px', marginBottom: '20px' },
                footer: { borderTop: 'none', padding: 0 }
            }}
        >
            <div style={{ marginBottom: '24px', backgroundColor: '#f9f9f9', padding: '16px', borderRadius: '12px' }}>
                <div style={{ marginBottom: '8px' }}>
                    <Text type="secondary" style={{ fontSize: '12px', display: 'block' }}>REPORTE</Text>
                    <Text strong style={{ fontSize: '16px' }}>{report?.title}</Text>
                </div>
                <Divider style={{ margin: '12px 0' }} />
                <div>
                    <Text type="secondary" style={{ fontSize: '12px', display: 'block' }}>DESCRIPCIÓN</Text>
                    <Text style={{ fontSize: '14px' }}>{report?.description}</Text>
                </div>
            </div>

            <Form form={form} layout="vertical">
                <Form.Item
                    name="admin_comment"
                    label={<Text strong>Comentario de Resolución</Text>}
                    rules={[{ required: true, message: 'Por favor ingresa un comentario' }]}
                >
                    <TextArea
                        rows={14}
                        placeholder="Explica detalladamente qué se hizo para resolver el reporte..."
                        style={{ borderRadius: '12px', padding: '12px', minHeight: '250px' }}
                    />
                </Form.Item>
                <div style={{
                    background: '#fff7e6',
                    padding: '12px',
                    borderRadius: '8px',
                    border: '1px solid #ffe7ba',
                    marginTop: '8px'
                }}>
                    <Text type="warning" style={{ fontSize: '12px', color: '#d46b08' }}>
                        ⚠️ Al resolver, el reporte se archivará y las imágenes se eliminarán permanentemente del servidor.
                    </Text>
                </div>
            </Form>
        </Modal>
    );
}
