import React from 'react';
import Style from './Statistic.module.css';

const ChartSkeleton = () => (
  <div className={Style.chartSkeletonWrapper}>
    {/* Título del gráfico skeleton */}
    <div className={Style.chartTitleSkeleton}>
      <div className={Style.skeletonBar} style={{ width: '180px', height: '24px', margin: '0 auto' }}></div>
    </div>
    
    {/* Subtítulo del gráfico skeleton */}
    <div className={Style.chartSubtitleSkeleton}>
      <div className={Style.skeletonBar} style={{ width: '120px', height: '16px', margin: '0 auto' }}></div>
    </div>

    {/* Cards de resumen skeleton */}
    <div className={Style.chartSummarySkeleton}>
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className={Style.summaryCardSkeleton}>
          <div className={Style.summaryIconSkeleton}>
            <div className={Style.skeletonBar} style={{ width: '20px', height: '20px', borderRadius: '50%' }}></div>
          </div>
          <div className={Style.summaryTextSkeleton}>
            <div className={Style.skeletonBar} style={{ width: '60px', height: '12px', marginBottom: '4px' }}></div>
            <div className={Style.skeletonBar} style={{ width: '40px', height: '16px' }}></div>
          </div>
        </div>
      ))}
    </div>

    {/* Área del gráfico skeleton */}
    <div className={Style.chartAreaSkeleton}>
      {/* Eje Y skeleton */}
      <div className={Style.chartYAxisSkeleton}>
        {[5, 4, 3, 2, 1, 0].map((i) => (
          <div key={i} className={Style.yAxisLabelSkeleton}>
            <div className={Style.skeletonBar} style={{ width: '30px', height: '12px' }}></div>
          </div>
        ))}
      </div>
      
      {/* Líneas del gráfico skeleton */}
      <div className={Style.chartLinesSkeleton}>
        <div className={Style.chartLineSkeleton}>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((i) => (
            <div key={i} className={Style.chartPointSkeleton}>
              <div 
                className={Style.skeletonBar} 
                style={{ 
                  width: '8px', 
                  height: '8px', 
                  borderRadius: '50%',
                  marginBottom: `${Math.random() * 60 + 20}px`
                }}
              ></div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Eje X skeleton */}
      <div className={Style.chartXAxisSkeleton}>
        {['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'].map((month, i) => (
          <div key={i} className={Style.xAxisLabelSkeleton}>
            <div className={Style.skeletonBar} style={{ width: '25px', height: '12px' }}></div>
          </div>
        ))}
      </div>
    </div>

    {/* Indicador de carga */}
    <div className={Style.chartLoadingIndicator}>
      <div className={Style.skeletonBar} style={{ width: '150px', height: '14px', margin: '0 auto' }}></div>
    </div>
  </div>
);

export default ChartSkeleton;
