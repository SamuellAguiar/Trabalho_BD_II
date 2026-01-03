import { useEffect, useState } from 'react';
import {
     BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
     PieChart, Pie, Cell, Legend
} from 'recharts';
import { FileText, Clock, Activity, CheckCircle, FileBarChart, Folder, Map } from 'lucide-react';

// IMPORTAÇÃO DE PDF CORRIGIDA
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

import api from '../../services/api';
import './Dashboard.css';

// Componentes UI Reutilizáveis
import KpiCard from '../../components/ui/KpiCard';
import ReportButton from '../../components/ui/ReportButton';

const Dashboard = () => {
     const [loading, setLoading] = useState(true);
     const [data, setData] = useState([]);

     // Estados para KPIs
     const [kpis, setKpis] = useState({ total: 0, pendente: 0, analisando: 0, resolvido: 0 });

     // Estados para Gráficos
     const [graficoStatus, setGraficoStatus] = useState([]);
     const [graficoCategoria, setGraficoCategoria] = useState([]);
     const [graficoSetor, setGraficoSetor] = useState([]);

     // Cores do Gráfico de Pizza
     const COLORS_STATUS = {
          'PENDENTE': '#e53e3e',   // Vermelho
          'ANALISANDO': '#dd6b20', // Laranja
          'RESOLVIDO': '#38a169'   // Verde
     };

     useEffect(() => {
          fetchData();
     }, []);

     async function fetchData() {
          try {
               const response = await api.get('/ocorrencias');
               const ocorrencias = response.data;
               setData(ocorrencias);
               processarDados(ocorrencias);
          } catch (error) {
               console.error("Erro ao carregar dashboard:", error);
          } finally {
               setLoading(false);
          }
     }

     const processarDados = (lista) => {
          // 1. Calcular KPIs
          const stats = {
               total: lista.length,
               pendente: lista.filter(i => i.status === 'PENDENTE').length,
               analisando: lista.filter(i => i.status === 'ANALISANDO').length,
               resolvido: lista.filter(i => i.status === 'RESOLVIDO').length
          };
          setKpis(stats);

          // 2. Preparar Gráfico de Status (Pizza)
          const statusData = [
               { name: 'Pendente', value: stats.pendente, color: COLORS_STATUS.PENDENTE },
               { name: 'Em Andamento', value: stats.analisando, color: COLORS_STATUS.ANALISANDO },
               { name: 'Resolvidos', value: stats.resolvido, color: COLORS_STATUS.RESOLVIDO }
          ].filter(item => item.value > 0);
          setGraficoStatus(statusData);

          // Helper para agrupar contagens
          const agruparPor = (campo, nomePadrao) => {
               const map = {};
               lista.forEach(oc => {
                    const nome = oc[campo] || nomePadrao;
                    map[nome] = (map[nome] || 0) + 1;
               });
               return Object.keys(map).map(key => ({ name: key, quantidade: map[key] }));
          };

          setGraficoCategoria(agruparPor('nome_categoria', 'Outros'));
          setGraficoSetor(agruparPor('nome_setor', 'Desconhecido'));
     };

     // --- FUNÇÃO GERAR PDF ---
     const gerarRelatorioPDF = (tipoRelatorio) => {
          try {
               const doc = new jsPDF();

               // Cabeçalho Padrão
               doc.setFontSize(18);
               doc.setTextColor(40, 40, 40);
               doc.text(`Relatório de Ocorrências - Foco em ${tipoRelatorio}`, 14, 22);

               doc.setFontSize(10);
               doc.setTextColor(100);
               doc.text(`Gerado em: ${new Date().toLocaleDateString()}`, 14, 30);

               // --- PERSONALIZAÇÃO POR TIPO ---
               let colunas = [];
               let dadosFormatados = [];
               let corCabecalho = [108, 99, 255]; // Roxo padrão

               // 1. Relatório por CATEGORIA
               if (tipoRelatorio === 'Categoria') {
                    corCabecalho = [221, 107, 32]; // Laranja
                    colunas = [['Categoria', 'Descrição', 'Setor', 'Status']];

                    // Ordena por Categoria
                    const dadosOrdenados = [...data].sort((a, b) => (a.nome_categoria || '').localeCompare(b.nome_categoria || ''));

                    dadosFormatados = dadosOrdenados.map(item => [
                         item.nome_categoria || 'Sem Categoria',
                         item.descricao.substring(0, 40) + '...',
                         item.nome_setor || 'N/A',
                         item.status
                    ]);
               }
               // 2. Relatório por SETOR
               else if (tipoRelatorio === 'Setor') {
                    corCabecalho = [0, 184, 148]; // Verde
                    colunas = [['Setor', 'Descrição', 'Categoria', 'Status']];

                    const dadosOrdenados = [...data].sort((a, b) => (a.nome_setor || '').localeCompare(b.nome_setor || ''));

                    dadosFormatados = dadosOrdenados.map(item => [
                         item.nome_setor || 'Sem Setor',
                         item.descricao.substring(0, 40) + '...',
                         item.nome_categoria || 'N/A',
                         item.status
                    ]);
               }
               // 3. Relatório por STATUS (Geral)
               else {
                    colunas = [['Status', 'Descrição', 'Setor', 'Categoria', 'Data']];

                    const dadosOrdenados = [...data].sort((a, b) => a.status.localeCompare(b.status));

                    dadosFormatados = dadosOrdenados.map(item => [
                         item.status,
                         item.descricao.substring(0, 35) + '...',
                         item.nome_setor || 'N/A',
                         item.nome_categoria || 'N/A',
                         new Date(item.data_hora).toLocaleDateString()
                    ]);
               }

               // Gerar Tabela
               autoTable(doc, {
                    head: colunas,
                    body: dadosFormatados,
                    startY: 35,
                    headStyles: { fillColor: corCabecalho },
                    styles: { fontSize: 9 },
                    alternateRowStyles: { fillColor: [245, 245, 250] }
               });

               doc.save(`relatorio_${tipoRelatorio.toLowerCase()}.pdf`);
          } catch (error) {
               console.error("Erro ao gerar PDF:", error);
               alert("Erro ao gerar PDF.");
          }
     };

     if (loading) return <div className="loading-screen">Carregando Dashboard...</div>;

     return (
          <div className="dashboard-container">

               {/* Título da Página (Sem abas, pois agora temos Sidebar) */}
               <div className="dashboard-header-content">
                    <h1>Visão Geral</h1>
                    <p>Acompanhe os indicadores do campus em tempo real</p>
               </div>

               {/* --- KPI CARDS (4 Colunas) --- */}
               <div className="kpi-grid">
                    <KpiCard title="Total" value={kpis.total} icon={FileText} color="purple" />
                    <KpiCard title="Pendentes" value={kpis.pendente} icon={Clock} color="yellow" />
                    <KpiCard title="Em Andamento" value={kpis.analisando} icon={Activity} color="blue" />
                    <KpiCard title="Resolvidos" value={kpis.resolvido} icon={CheckCircle} color="green" />
               </div>

               {/* --- LINHA 1 DE GRÁFICOS --- */}
               <div className="charts-row">

                    {/* Gráfico Pizza */}
                    <div className="chart-card">
                         <h3>Distribuição por Status</h3>
                         <div className="chart-wrapper">
                              <ResponsiveContainer width="100%" height={250}>
                                   <PieChart>
                                        <Pie
                                             data={graficoStatus}
                                             cx="50%" cy="50%"
                                             innerRadius={60}
                                             outerRadius={80}
                                             paddingAngle={5}
                                             dataKey="value"
                                        >
                                             {graficoStatus.map((entry, index) => (
                                                  <Cell key={`cell-${index}`} fill={entry.color} />
                                             ))}
                                        </Pie>
                                        <Tooltip />
                                        <Legend verticalAlign="bottom" />
                                   </PieChart>
                              </ResponsiveContainer>
                         </div>
                    </div>

                    {/* Gráfico Barras (Categorias) - Roxo */}
                    <div className="chart-card">
                         <h3>Ocorrências por Categoria</h3>
                         <div className="chart-wrapper">
                              <ResponsiveContainer width="100%" height={250}>
                                   <BarChart data={graficoCategoria}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                        <XAxis dataKey="name" fontSize={11} tickLine={false} axisLine={false} interval={0} />
                                        <YAxis allowDecimals={false} axisLine={false} tickLine={false} />
                                        <Tooltip cursor={{ fill: '#f7fafc' }} />
                                        <Bar dataKey="quantidade" fill="#6c63ff" radius={[4, 4, 0, 0]} barSize={40} />
                                   </BarChart>
                              </ResponsiveContainer>
                         </div>
                    </div>
               </div>

               {/* --- LINHA 2 DE GRÁFICOS (Full Width) --- */}
               <div className="chart-card full-width">
                    <h3>Ocorrências por Setor</h3>
                    <div className="chart-wrapper">
                         <ResponsiveContainer width="100%" height={300}>
                              <BarChart data={graficoSetor}>
                                   <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                   <XAxis dataKey="name" fontSize={11} tickLine={false} axisLine={false} />
                                   <YAxis allowDecimals={false} axisLine={false} tickLine={false} />
                                   <Tooltip cursor={{ fill: '#f7fafc' }} />
                                   {/* Barra Verde Teal (#00b894) */}
                                   <Bar dataKey="quantidade" fill="#00b894" radius={[4, 4, 0, 0]} barSize={50} />
                              </BarChart>
                         </ResponsiveContainer>
                    </div>
               </div>

               {/* --- BOTÕES DE RELATÓRIO --- */}
               <div className="reports-section">
                    <h3>📥 Gerar Relatórios (PDF)</h3>
                    <div className="reports-grid">
                         <ReportButton icon={FileBarChart} label="Relatório Status" onClick={() => gerarRelatorioPDF('Status')} />
                         <ReportButton icon={Folder} label="Relatório Categorias" onClick={() => gerarRelatorioPDF('Categoria')} />
                         <ReportButton icon={Map} label="Relatório Setores" onClick={() => gerarRelatorioPDF('Setor')} />
                    </div>
               </div>

          </div>
     );
};

export default Dashboard;