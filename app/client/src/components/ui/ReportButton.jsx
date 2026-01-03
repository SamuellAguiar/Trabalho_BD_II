import React from 'react';
import './UiComponents.css';

const ReportButton = ({ icon: Icon, label, onClick }) => {
     return (
          <button className="report-btn" onClick={onClick}>
               <div className="report-icon">
                    <Icon size={24} color="#6c63ff" />
               </div>
               <span>{label}</span>
          </button>
     );
};

export default ReportButton;