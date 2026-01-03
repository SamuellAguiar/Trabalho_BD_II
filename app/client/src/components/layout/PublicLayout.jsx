import { Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard } from 'lucide-react';
import './PublicLayout.css';
import Button from '../ui/Button'; // Reaproveitando nosso botão!

const PublicLayout = () => {
     const location = useLocation();

     // Função simples para saber se o link está ativo
     const isActive = (path) => location.pathname === path ? 'active' : '';

     return (
          <div className="layout-container">
               {/* Cabeçalho Minimalista */}
               <header className="public-header">
                    <div className="header-content centered-content">
                         {/* Logo / Nome do Sistema */}
                         <div className="logo-area">
                              <Link to="/">
                                   <span className="logo-icon">🎓</span>
                                   <span className="logo-text">Sentinel</span>
                              </Link>
                         </div>

                         {/* Navegação */}
                         <nav className="public-nav">
                              <Link to="/" className={`nav-link ${isActive('/')}`}>Home</Link>
                              <Link to="/lista" className={`nav-link ${isActive('/lista')}`}>Ver Ocorrências</Link>

                              {/* Botão de Destaque no Menu */}
                              <div className="nav-cta">
                                   <Button to="/nova" variant="solid">Registrar +</Button>
                              </div>
                         </nav>
                    </div>
               </header>

               {/* Conteúdo das Páginas (Home, Nova, Lista) */}
               <main className="public-content">
                    <Outlet />
               </main>

               {/* Rodapé Simples */}
               <footer className="public-footer">
                    <div className="centered-content footer-flex">
                         <p>© 2025 UFOP - Departamento de Computação</p>

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