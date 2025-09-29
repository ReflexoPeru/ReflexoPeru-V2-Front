import React from 'react';
import Style from './Statistic.module.css';

const SkeletonLoading = () => (
  <div className={Style.bottomSection}>
    {/* Skeleton para Distribución de Pagos */}
    <div className={Style.paymentSection}>
      <div className={Style.sectionTitleSkeleton}>
        <div className={Style.skeletonBar} style={{ width: '200px', height: '24px' }}></div>
      </div>
      <div className={Style.sectionSubtitleSkeleton}>
        <div className={Style.skeletonBar} style={{ width: '250px', height: '16px' }}></div>
      </div>
      <div style={{ 
        textAlign: 'center', 
        marginBottom: '16px', 
        fontSize: '14px', 
        color: '#666',
        fontStyle: 'italic'
      }}>
      </div>
      <div className={Style.paymentChartSkeleton}>
        <div className={Style.chartSkeletonContainer}>
          {/* Barras del gráfico skeleton */}
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className={Style.chartBarSkeleton}>
              <div className={Style.skeletonBar} style={{ 
                width: `${Math.random() * 60 + 20}%`, 
                height: '40px',
                marginBottom: '8px'
              }}></div>
            </div>
          ))}
        </div>
      </div>
    </div>

    {/* Skeleton para Rendimiento de Terapeutas */}
    <div className={Style.therapistsSection}>
      <div className={Style.sectionTitleSkeleton}>
        <div className={Style.skeletonBar} style={{ width: '220px', height: '24px' }}></div>
      </div>
      <div className={Style.sectionSubtitleSkeleton}>
        <div className={Style.skeletonBar} style={{ width: '180px', height: '16px' }}></div>
      </div>
      <div style={{ 
        textAlign: 'center', 
        marginBottom: '16px', 
        fontSize: '14px', 
        color: '#666',
        fontStyle: 'italic'
      }}>
      </div>
      <div className={Style.therapistsTableSkeleton}>
        {/* Header skeleton */}
        <div className={Style.tableHeaderSkeleton}>
          <div className={Style.skeletonBar} style={{ width: '120px', height: '16px' }}></div>
          <div className={Style.skeletonBar} style={{ width: '80px', height: '16px' }}></div>
          <div className={Style.skeletonBar} style={{ width: '90px', height: '16px' }}></div>
          <div className={Style.skeletonBar} style={{ width: '70px', height: '16px' }}></div>
        </div>
        {/* Filas skeleton */}
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className={Style.tableRowSkeleton} style={{ 
            backgroundColor: i % 2 === 0 ? '#fafafa' : '#ffffff' 
          }}>
            <div className={Style.skeletonBar} style={{ width: '140px', height: '14px' }}></div>
            <div className={Style.skeletonBar} style={{ width: '40px', height: '14px' }}></div>
            <div className={Style.skeletonBar} style={{ width: '80px', height: '14px' }}></div>
            <div className={Style.skeletonBar} style={{ width: '30px', height: '14px' }}></div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default SkeletonLoading;
