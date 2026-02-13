import { useNavigate } from 'react-router-dom';
import {
     PlusCircle, List, ShieldCheck, MapPin,
     Activity, ArrowRight, Zap, CheckCircle, Camera, MousePointer
} from 'lucide-react';
import './Home.css';
import Button from '../../components/ui/Button';

const Home = () => {
     const navigate = useNavigate();

     return (
          <div className="home-wrapper">

               <section className="hero-section">
                    <div className="hero-bg-glow"></div>

                    <div className="hero-content-centered">
                         <span className="hero-badge">Gestão Inteligente</span>

                         <h1 className="hero-title">
                              O Campus mais seguro e eficiente<br />
                              começa <span className="text-gradient">agora.</span>
                         </h1>

                         <p className="hero-subtitle">
                              Conecte-se diretamente à equipe de manutenção e segurança.
                              Reporte problemas e acompanhe a resolução em tempo real.
                         </p>

                         <div className="hero-buttons center-flex">
                              <Button onClick={() => navigate('/nova')} variant="solid" className="btn-hero-primary">
                                   Começar Agora
                              </Button>
                              <Button onClick={() => navigate('/lista')} variant="outline" className="btn-hero-secondary">
                                   Ver Ocorrências
                              </Button>
                         </div>

                         <div className="hero-mini-stats center-flex">
                              <div className="mini-stat">
                                   <strong>+500</strong> <span>Resolvidos</span>
                              </div>
                              <div className="divider"></div>
                              <div className="mini-stat">
                                   <strong>24h</strong> <span>Online</span>
                              </div>
                              <div className="divider"></div>
                              <div className="mini-stat">
                                   <div className="flex-align"><CheckCircle size={16} color="#00b894" style={{ marginRight: 4 }} /> Oficial</div>
                              </div>
                         </div>
                    </div>

                    <div className="hero-wave">
                         <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M0 60L60 55C120 50 240 40 360 45C480 50 600 70 720 75C840 80 960 70 1080 60C1200 50 1320 40 1380 35L1440 30V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0V60Z" fill="#fafafa" />
                         </svg>
                    </div>
               </section>

               <section className="steps-section centered-content">
                    <div className="section-header">
                         <span className="section-tag">Simples e Rápido</span>
                         <h2>Como usar o Sentinel</h2>
                         <p>Você não precisa ser um expert. Ajude o campus em 3 passos.</p>
                    </div>

                    <div className="steps-grid">
                         <div className="step-card">
                              <div className="step-number">01</div>
                              <div className="step-icon"><Camera size={32} color="#6c63ff" /></div>
                              <h3>Identifique & Registre</h3>
                              <p>Viu uma lâmpada queimada ou algo quebrado? Tire uma foto e descreva o problema.</p>
                         </div>
                         <div className="step-card">
                              <div className="step-number">02</div>
                              <div className="step-icon"><MapPin size={32} color="#6c63ff" /></div>
                              <h3>Geolocalização</h3>
                              <p>Nosso sistema captura sua posição exata para que a equipe saiba onde ir.</p>
                         </div>
                         <div className="step-card">
                              <div className="step-number">03</div>
                              <div className="step-icon"><CheckCircle size={32} color="#6c63ff" /></div>
                              <h3>Problema Resolvido</h3>
                              <p>Acompanhe o status em tempo real até que a solução seja concluída.</p>
                         </div>
                    </div>
               </section>

               <section className="features-section centered-content">
                    <div className="features-container-box">
                         <div className="features-text">
                              <h2>Ferramentas Poderosas</h2>
                              <p>Tudo o que você precisa para manter a ordem e a segurança em um só lugar.</p>
                              <Button onClick={() => navigate('/lista')} variant="outline">
                                   Explorar Sistema <ArrowRight size={18} style={{ marginLeft: 8 }} />
                              </Button>
                         </div>

                         <div className="features-grid-tight">
                              <div className="feat-item">
                                   <ShieldCheck size={28} color="#00b894" />
                                   <strong>Segurança</strong>
                                   <p>Relatos anônimos e seguros.</p>
                              </div>
                              <div className="feat-item">
                                   <Zap size={28} color="#dd6b20" />
                                   <strong>Agilidade</strong>
                                   <p>Notificações instantâneas.</p>
                              </div>
                              <div className="feat-item">
                                   <List size={28} color="#3182ce" />
                                   <strong>Histórico</strong>
                                   <p>Registro completo de ações.</p>
                              </div>
                              <div className="feat-item">
                                   <MousePointer size={28} color="#6c63ff" />
                                   <strong>Facilidade</strong>
                                   <p>Interface intuitiva.</p>
                              </div>
                         </div>
                    </div>
               </section>

               <section className="cta-section">
                    <div className="cta-content centered-content">
                         <h2>Pronto para fazer a diferença?</h2>
                         <p>Junte-se a centenas de alunos e funcionários que estão transformando nosso campus.</p>
                         <Button onClick={() => navigate('/nova')} className="btn-cta-big">
                              Criar Minha Primeira Ocorrência
                         </Button>
                    </div>
               </section>
          </div>
     );
};

export default Home;