import React from 'react';
import './UiComponents.css'; // Vamos adicionar os estilos aqui

const KpiCard = ({ title, value, icon: Icon, color = 'purple' }) => {

     // Mapeia a cor passada para classes de fundo e cor de texto
     const colorMap = {
          purple: { bg: 'bg-purple-light', text: '#6c63ff' },
          yellow: { bg: 'bg-yellow-light', text: '#d69e2e' },
          blue: { bg: 'bg-blue-light', text: '#3182ce' },
          green: { bg: 'bg-green-light', text: '#38a169' },
     };

     const theme = colorMap[color] || colorMap.purple;

     return (
          <div className="kpi-card">
               <div className="kpi-info">
                    <span>{title}</span>
                    <strong style={{ color: theme.text }}>{value}</strong>
               </div>
               <div className={`kpi-icon ${theme.bg}`}>
                    <Icon size={24} color={theme.text} />
               </div>
          </div>
     );
};

export default KpiCard;