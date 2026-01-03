import { FileText, MapPin, ListChecks, LayoutDashboard, Users, CheckCircle } from 'lucide-react';
import './Home.css';

// Importando nossos componentes reutilizáveis
import Button from '../../components/ui/Button';
import FeatureCard from '../../components/ui/FeatureCard';
import StatCard from '../../components/ui/StatCard';

const Home = () => {
     return (
          <div className="home-wrapper">

               {/* SEÇÃO 1: HERO */}
               <section className="hero-section centered-content">
                    <h1 className="hero-title">Sistema de Registro de Ocorrências</h1>
                    <p className="hero-subtitle">
                         Uma plataforma completa para registrar e gerenciar ocorrências dentro da faculdade.
                         Reporte problemas, encontre objetos perdidos e ajude a melhorar nosso ambiente acadêmico.
                    </p>

                    <div className="hero-buttons">
                         <Button to="/nova" variant="solid">Registrar Ocorrência</Button>
                         <Button to="/lista" variant="outline">Ver Ocorrências</Button>
                    </div>
               </section>

               {/* SEÇÃO 2: FEATURES (Agora usando Componentes!) */}
               <section className="features-grid centered-content grid-4">
                    <FeatureCard
                         icon={FileText}
                         title="Registrar Ocorrências"
                         description="Reporte problemas, achados e perdidos, ou qualquer situação que necessite atenção."
                    />
                    <FeatureCard
                         icon={MapPin}
                         title="Geolocalização"
                         description="Identifique o local exato da ocorrência com precisão no mapa do campus."
                    />
                    <FeatureCard
                         icon={ListChecks}
                         title="Acompanhamento"
                         description="Visualize todas as ocorrências e seus status em tempo real."
                    />
                    <FeatureCard
                         icon={LayoutDashboard}
                         title="Dashboard Administrativo"
                         description="Gerencie ocorrências, categorias e setores em um único lugar (Área restrita)."
                    />
               </section>

               {/* SEÇÃO 3: COMO FUNCIONA (Mantive HTML puro pois é muito específico desta página) */}
               <section className="how-it-works-section centered-content">
                    <div className="big-white-card">
                         <h2 className="section-title">Como Funciona</h2>
                         <div className="steps-grid grid-3">
                              <div className="step-item">
                                   <div className="step-number">1</div>
                                   <h3>Registre a Ocorrência</h3>
                                   <p>Preencha o formulário com detalhes sobre o problema, adicione fotos e a localização.</p>
                              </div>
                              <div className="step-item">
                                   <div className="step-number">2</div>
                                   <h3>Acompanhe o Status</h3>
                                   <p>Veja o progresso da resolução através do painel público de ocorrências.</p>
                              </div>
                              <div className="step-item">
                                   <div className="step-number">3</div>
                                   <h3>Problema Resolvido</h3>
                                   <p>A equipe responsável resolverá a situação e atualizará o status para concluído.</p>
                              </div>
                         </div>
                    </div>
               </section>

               {/* SEÇÃO 4: ESTATÍSTICAS (Agora usando Componentes!) */}
               <section className="stats-grid centered-content grid-3">
                    <StatCard icon={Users} number="500+" label="Membros da Comunidade" color="blue" />
                    <StatCard icon={FileText} number="1,200+" label="Ocorrências Registradas" color="green" />
                    <StatCard icon={CheckCircle} number="95%" label="Taxa de Resolução" color="purple" />
               </section>

          </div>
     );
};

export default Home;