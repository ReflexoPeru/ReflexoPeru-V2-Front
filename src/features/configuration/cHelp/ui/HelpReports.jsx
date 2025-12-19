import React, { useState } from 'react';
import { Typography, Space, Tabs, Empty, Spin, Button, message, Tag } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useHelpReports } from '../hook/useHelpReports';
import HelpCard from './components/HelpCard';
import ReportFormModal from './components/ReportFormModal';
import ResolveReportModal from './components/ResolveReportModal';
import CustomButton from '../../../../components/Button/CustomButton';
import { AnimatePresence } from 'framer-motion';

const { Title, Text } = Typography;

export default function HelpReports() {
    const {
        reports,
        loading,
        isAdmin,
        handleCreate,
        handleUpdate,
        handleResolve
    } = useHelpReports();

    const [isFormVisible, setIsFormVisible] = useState(false);
    const [isResolveVisible, setIsResolveVisible] = useState(false);
    const [selectedReport, setSelectedReport] = useState(null);
    const [activeTab, setActiveTab] = useState('pending');

    const showCreateModal = () => {
        setSelectedReport(null);
        setIsFormVisible(true);
    };

    const showEditModal = (report) => {
        setSelectedReport(report);
        setIsFormVisible(true);
    };

    const showResolveModal = (report) => {
        setSelectedReport(report);
        setIsResolveVisible(true);
    };

    const handleFormSubmit = async (formData) => {
        try {
            if (selectedReport) {
                await handleUpdate(selectedReport.id, formData);
                message.success('Reporte actualizado correctamente');
            } else {
                await handleCreate(formData);
                message.success('Reporte enviado con éxito');
            }
            setIsFormVisible(false);
        } catch (error) {
            message.error('Ocurrió un error al procesar el reporte');
        }
    };

    const handleResolveSubmit = async (id, data) => {
        try {
            await handleResolve(id, data);
            message.success('Reporte resuelto y archivado');
            setIsResolveVisible(false);
        } catch (error) {
            message.error('Error al resolver el reporte');
        }
    };

    // Filtrar reportes según tab
    const filteredReports = reports.filter(r => r.status === activeTab);

    return (
        <div style={{ padding: '30px', maxWidth: '1400px', margin: '0 auto', height: '100%', overflowY: 'auto' }}>
            <style>
                {`
                    .ant-image-preview-mask {
                        background-color: rgba(0, 0, 0, 0.85) !important;
                    }
                    .custom-tabs .ant-tabs-nav::before {
                        border-bottom: 1px solid #f5f5f5;
                    }
                    .ant-modal-centered .ant-modal {
                        top: 0;
                    }
                `}
            </style>
            <div style={{
                backgroundColor: 'white',
                borderRadius: '24px',
                padding: '40px',
                boxShadow: '0 10px 40px rgba(0, 0, 0, 0.04)',
                minHeight: 'calc(100vh - 120px)',
                display: 'flex',
                flexDirection: 'column',
                border: '1px solid #f0f0f0'
            }}>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '40px',
                    flexWrap: 'wrap',
                    gap: '24px',
                    borderBottom: '1px solid #f5f5f5',
                    paddingBottom: '32px'
                }}>
                    <div>
                        <Title level={1} style={{ margin: 0, color: 'var(--color-primary)', fontWeight: '850', fontSize: '36px', letterSpacing: '-0.5px' }}>
                            Centro de Ayuda y Reportes
                        </Title>
                        <Text type="secondary" style={{ fontSize: '18px', marginTop: '8px', display: 'block', opacity: 0.8 }}>
                            {isAdmin
                                ? 'Gestiona las incidencias y sugerencias de los usuarios de la plataforma.'
                                : '¿Encontraste algo que no funciona? Cuéntanos para arreglarlo de inmediato.'}
                        </Text>
                    </div>

                    {!isAdmin && (
                        <CustomButton
                            text="Nuevo Reporte"
                            icon={<PlusOutlined />}
                            onClick={showCreateModal}
                            size="md"
                            style={{
                                height: '42px',
                                padding: '0 24px',
                                fontSize: '14px',
                                borderRadius: '10px',
                                boxShadow: '0 4px 12px rgba(28, 181, 74, 0.2)'
                            }}
                        />
                    )}
                </div>

                <Tabs
                    activeKey={activeTab}
                    onChange={setActiveTab}
                    className="custom-tabs"
                    style={{ marginBottom: '32px' }}
                    items={[
                        {
                            key: 'pending',
                            label: (
                                <Space>
                                    <span>Pendientes</span>
                                    <Tag color="orange" style={{ margin: 0, borderRadius: '6px' }}>{reports.filter(r => r.status === 'pending').length}</Tag>
                                </Space>
                            )
                        },
                        {
                            key: 'reviewed',
                            label: (
                                <Space>
                                    <span>Resueltos</span>
                                    <Tag color="green" style={{ margin: 0, borderRadius: '6px' }}>{reports.filter(r => r.status === 'reviewed').length}</Tag>
                                </Space>
                            )
                        },
                    ]}
                />

                <div style={{ flex: 1 }}>
                    {loading ? (
                        <div style={{ display: 'flex', justifyContent: 'center', padding: '120px' }}>
                            <Spin size="large" tip="Cargando reportes..." />
                        </div>
                    ) : filteredReports.length > 0 ? (
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))',
                            gap: '32px',
                            alignItems: 'start'
                        }}>
                            <AnimatePresence>
                                {filteredReports.map(report => (
                                    <HelpCard
                                        key={report.id}
                                        report={report}
                                        isAdmin={isAdmin}
                                        onEdit={showEditModal}
                                        onResolve={showResolveModal}
                                    />
                                ))}
                            </AnimatePresence>
                        </div>
                    ) : (
                        <div style={{
                            height: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            minHeight: '300px'
                        }}>
                            <Empty
                                image={Empty.PRESENTED_IMAGE_SIMPLE}
                                description={
                                    <div style={{ textAlign: 'center' }}>
                                        <Text type="secondary" style={{ fontSize: '16px' }}>No hay reportes en esta sección</Text>
                                        <div style={{ marginTop: '16px' }}>
                                            {activeTab === 'pending' && !isAdmin && (
                                                <Button
                                                    type="primary"
                                                    onClick={showCreateModal}
                                                    style={{ borderRadius: '8px', height: '40px' }}
                                                >
                                                    Enviar mi primer reporte
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                }
                            />
                        </div>
                    )}
                </div>
            </div>

            <ReportFormModal
                visible={isFormVisible}
                onCancel={() => setIsFormVisible(false)}
                onSubmit={handleFormSubmit}
                initialValues={selectedReport}
                loading={loading}
            />

            <ResolveReportModal
                visible={isResolveVisible}
                onCancel={() => setIsResolveVisible(false)}
                onResolve={handleResolveSubmit}
                loading={loading}
                report={selectedReport}
            />

            <style>{`
        .custom-tabs .ant-tabs-nav::before {
          border-bottom: 2px solid var(--color-border-secondary);
        }
        .custom-tabs .ant-tabs-tab {
          font-weight: 500;
          color: var(--color-text-secondary);
        }
        .custom-tabs .ant-tabs-tab-active .ant-tabs-tab-btn {
          color: var(--color-primary) !important;
        }
        .custom-tabs .ant-tabs-ink-bar {
          background: var(--color-primary) !important;
          height: 3px !important;
        }
      `}</style>
        </div>
    );
}
