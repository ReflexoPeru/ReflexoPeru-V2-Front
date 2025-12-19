import React, { useState } from 'react';
import { Card, Tag, Button, Typography, Space, Tooltip, Image, Divider, Collapse, Spin } from 'antd';
import {
    ClockCircleOutlined,
    CheckCircleOutlined,
    ExclamationCircleOutlined,
    EditOutlined,
    EyeOutlined,
    MessageOutlined,
    PaperClipOutlined,
    DownOutlined
} from '@ant-design/icons';
import { motion, AnimatePresence } from 'framer-motion';
import dayjs from 'dayjs';
import { getFullImageUrl } from '../../../../../utils/imageUtils';

const { Text, Title, Paragraph } = Typography;
const { Panel } = Collapse;

const statusConfig = {
    pending: { color: 'warning', text: 'Pendiente', icon: <ClockCircleOutlined /> },
    reviewed: { color: 'success', text: 'Resuelto', icon: <CheckCircleOutlined /> },
};

const priorityConfig = {
    low: { color: 'blue', text: 'Baja' },
    medium: { color: 'orange', text: 'Media' },
    high: { color: 'red', text: 'Alta' },
};

const typeConfig = {
    error: 'Fallo',
    suggestion: 'Sugerencia',
    support: 'Soporte',
    other: 'Otro'
};

export default function HelpCard({ report, onEdit, onResolve, isAdmin }) {
    const status = statusConfig[report.status] || statusConfig.pending;
    const priority = priorityConfig[report.priority] || priorityConfig.medium;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
        >
            <Card
                hoverable
                style={{
                    borderRadius: '20px',
                    border: '1px solid #f0f0f0',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    backgroundColor: '#fff',
                    overflow: 'hidden'
                }}
                bodyStyle={{ padding: '0' }}
            >
                {/* Header Section */}
                <div style={{ padding: '24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                        <Tag
                            color={priority.color}
                            style={{
                                margin: 0,
                                borderRadius: '6px',
                                border: 'none',
                                padding: '2px 10px',
                                fontWeight: '600'
                            }}
                        >
                            {priority.text}
                        </Tag>
                        <Tag
                            icon={status.icon}
                            color={status.color}
                            style={{
                                margin: 0,
                                borderRadius: '20px',
                                padding: '2px 14px',
                                fontSize: '13px',
                                border: 'none',
                                fontWeight: '500'
                            }}
                        >
                            {status.text}
                        </Tag>
                    </div>

                    <Title level={4} style={{
                        margin: '0 0 8px 0',
                        fontSize: '18px',
                        fontWeight: '750',
                        color: '#1a1a1a',
                        lineHeight: '1.4'
                    }}>
                        {report.title}
                    </Title>

                    <Space size={6} split={<Divider type="vertical" />} style={{ opacity: 0.5, fontSize: '12px' }}>
                        <Text type="secondary">{typeConfig[report.type]}</Text>
                        <Text type="secondary">{dayjs(report.created_at).format('DD MMM, YYYY')}</Text>
                    </Space>
                </div>

                {/* Details Accordion */}
                <Collapse
                    ghost
                    expandIcon={({ isActive }) => <DownOutlined rotate={isActive ? 180 : 0} style={{ fontSize: '12px', color: 'var(--color-primary)' }} />}
                    expandIconPosition="end"
                    style={{ backgroundColor: '#fafafa', borderTop: '1px solid #f0f0f0' }}
                >
                    <Panel
                        header={
                            <Space size={8}>
                                <PaperClipOutlined style={{ color: 'var(--color-primary)' }} />
                                <Text strong style={{ fontSize: '13px' }}>Ver detalles y adjuntos</Text>
                            </Space>
                        }
                        key="1"
                        style={{ borderBottom: 'none' }}
                    >
                        <div style={{ padding: '0 0 16px 0' }}>
                            <Paragraph style={{ color: '#4a4a4a', fontSize: '14px', lineHeight: '1.6' }}>
                                {report.description}
                            </Paragraph>

                            {report.images && report.images.length > 0 && (
                                <div style={{ marginTop: '16px' }}>
                                    <Image.PreviewGroup>
                                        <div style={{
                                            display: 'grid',
                                            gridTemplateColumns: report.images.length === 1 ? '1fr' : 'repeat(auto-fill, minmax(100px, 1fr))',
                                            gap: '12px'
                                        }}>
                                            {report.images.map((img, index) => (
                                                <Image
                                                    key={index}
                                                    src={getFullImageUrl(img)}
                                                    alt={`Captura ${index + 1}`}
                                                    style={{
                                                        width: '100%',
                                                        height: report.images.length === 1 ? '220px' : '100px',
                                                        objectFit: 'cover',
                                                        borderRadius: '12px',
                                                        boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                                                    }}
                                                    placeholder={
                                                        <div style={{
                                                            height: report.images.length === 1 ? '220px' : '100px',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            background: '#f5f5f5',
                                                            borderRadius: '12px'
                                                        }}>
                                                            <Spin size="small" />
                                                        </div>
                                                    }
                                                />
                                            ))}
                                        </div>
                                    </Image.PreviewGroup>
                                </div>
                            )}

                            {report.admin_comment && (
                                <div style={{
                                    marginTop: '20px',
                                    background: '#f0fff4',
                                    padding: '16px',
                                    borderRadius: '12px',
                                    border: '1px solid #c6f6d5'
                                }}>
                                    <Space align="start" size={12}>
                                        <div style={{
                                            width: '32px',
                                            height: '32px',
                                            borderRadius: '10px',
                                            backgroundColor: 'var(--color-primary)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: 'white'
                                        }}>
                                            <MessageOutlined />
                                        </div>
                                        <div>
                                            <Text strong style={{ fontSize: '13px', color: '#276749', display: 'block', marginBottom: '4px' }}>
                                                Respuesta de Soporte
                                            </Text>
                                            <Text style={{ color: '#2d3748', fontSize: '13.5px' }}>{report.admin_comment}</Text>
                                        </div>
                                    </Space>
                                </div>
                            )}
                        </div>
                    </Panel>
                </Collapse>

                {/* Footer Section */}
                <div style={{
                    padding: '20px 24px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderTop: '1px solid #f0f0f0'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        {isAdmin ? (
                            <>
                                <div style={{
                                    width: '32px',
                                    height: '32px',
                                    borderRadius: '10px',
                                    backgroundColor: '#f0f0f0',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '12.5px',
                                    fontWeight: '700',
                                    color: '#666'
                                }}>
                                    {report.user?.name?.[0] || 'U'}
                                </div>
                                <Text style={{ fontSize: '13px', fontWeight: '500', color: '#444' }}>{report.user?.name}</Text>
                            </>
                        ) : (
                            <Text type="secondary" style={{ fontSize: '12px' }}>
                                ID: #{report.id.toString().padStart(4, '0')}
                            </Text>
                        )}
                    </div>

                    <Space>
                        {!isAdmin && report.status === 'pending' && (
                            <Tooltip title="Editar reporte">
                                <Button
                                    icon={<EditOutlined />}
                                    onClick={() => onEdit(report)}
                                    type="text"
                                    style={{
                                        color: 'var(--color-primary)',
                                        backgroundColor: '#f0fff4',
                                        borderRadius: '8px',
                                        width: '36px',
                                        height: '36px'
                                    }}
                                />
                            </Tooltip>
                        )}

                        {isAdmin && report.status === 'pending' && (
                            <Button
                                type="primary"
                                onClick={() => onResolve(report)}
                                style={{
                                    backgroundColor: 'var(--color-primary)',
                                    borderRadius: '10px',
                                    height: '36px',
                                    padding: '0 20px',
                                    fontWeight: '600',
                                    boxShadow: '0 4px 10px rgba(28, 181, 74, 0.2)'
                                }}
                            >
                                Atender
                            </Button>
                        )}
                    </Space>
                </div>
            </Card>
        </motion.div>
    );
}
