import { Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard } from 'lucide-react';
import './PublicLayout.css';
import Button from '../ui/Button'; 

const PublicLayout = () => {
     const location = useLocation();

     const isActive = (path) => location.pathname === path ? 'active' : '';

     return (
          <div className="layout-container">
               <header className="public-header">
                    <div className="header-content centered-content">
                         <div className="logo-area">
                              <Link to="/">
                                   <span className="logo-icon">🎓</span>
                                   <span className="logo-text">Sentinel</span>
                              </Link>
                         </div>

                         <nav className="public-nav">
                              <Link to="/" className={`nav-link ${isActive('/')}`}>Home</Link>
                              <Link to="/lista" className={`nav-link ${isActive('/lista')}`}>Ver Ocorrências</Link>

                              <div className="nav-cta">
                                   <Button to="/nova" variant="solid">Registrar +</Button>
                              </div>
                         </nav>
                    </div>
               </header>

               <main className="public-content">
                    <Outlet />
               </main>

               <footer className="public-footer">
                    <div className="centered-content footer-flex">
                         <p>© 2025 UFOP - Sentinel</p>

                         <Link to="/login-admin" className="admin-access-link">
                              <LayoutDashboard size={16} />
                              <span>Acesso Administrativo</span>
                         </Link>
                    </div>
               </footer>
          </div>
     );
};

export default PublicLayout;