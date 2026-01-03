import './UiComponents.css';

const FeatureCard = ({ icon: Icon, title, description }) => {
     return (
          <div className="feature-card-white">
               <div className="icon-wrapper">
                    <Icon size={24} color="#6c63ff" />
               </div>
               <h3>{title}</h3>
               <p>{description}</p>
          </div>
     );
};

export default FeatureCard;