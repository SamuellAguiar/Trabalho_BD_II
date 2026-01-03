import './UiComponents.css';

const StatCard = ({ icon: Icon, number, label, color = 'blue' }) => {
     return (
          <div className={`stat-card ${color}`}>
               <div className="stat-icon">
                    <Icon size={32} color="white" />
               </div>
               <div className="stat-info">
                    <span className="stat-number">{number}</span>
                    <span className="stat-label">{label}</span>
               </div>
          </div>
     );
};

export default StatCard;