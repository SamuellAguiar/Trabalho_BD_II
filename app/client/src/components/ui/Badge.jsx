import React from 'react';
import './Badge.css';

const Badge = ({ status }) => {
     const config = {
          'PENDENTE': { label: 'Pendente', className: 'badge-yellow' },
          'ANALISANDO': { label: 'Em Andamento', className: 'badge-blue' },
          'RESOLVIDO': { label: 'Resolvido', className: 'badge-green' }
     };

     const current = config[status] || { label: status, className: 'badge-gray' };

     return (
          <span className={`badge ${current.className}`}>
               {current.label}
          </span>
     );
};

export default Badge;