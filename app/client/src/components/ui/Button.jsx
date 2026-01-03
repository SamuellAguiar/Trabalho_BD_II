import { Link } from 'react-router-dom';
import './UiComponents.css';

const Button = ({ children, variant = 'solid', to, onClick, type = 'button' }) => {
     const className = `btn-purple ${variant}`;

     if (to) {
          return <Link to={to} className={className}>{children}</Link>;
     }

     return (
          <button type={type} className={className} onClick={onClick}>
               {children}
          </button>
     );
};

export default Button;