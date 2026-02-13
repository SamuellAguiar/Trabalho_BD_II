import { useEffect, useState } from 'react';
import {
     BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
     PieChart, Pie, Cell, Legend
} from 'recharts';
import {
     FileText, Clock, Activity, CheckCircle,
     FileBarChart, Folder, Map as MapIcon, Calendar, AlertTriangle
} from 'lucide-react';
import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

import logoImg from '/favicon.png';

import api from '../../services/api';
import './Dashboard.css';

import KpiCard from '../../components/ui/KpiCard';
import ReportButton from '../../components/ui/ReportButton';
import HeatmapLayer from '../../components/ui/HeatmapLayer';

const Dashboard = () => {
     const [loading, setLoading] = useState(true);
     const [data, setData] = useState([]);

     // Estados de Dados
     const [kpis, setKpis] = useState({ total: 0, pendente: 0, analisando: 0, resolvido: 0 });
     const [graficoStatus, setGraficoStatus] = useState([]);
     const [graficoCategoria, setGraficoCategoria] = useState([]);
     const [graficoSetor, setGraficoSetor] = useState([]);
     const [graficoLinha, setGraficoLinha] = useState([]);
     const [pontosMapa, setPontosMapa] = useState([]);

     // Cores do Sistema
     const COLORS_STATUS = {
          'PENDENTE': '#e53e3e',   
          'ANALISANDO': '#dd6b20',
          'RESOLVIDO': '#38a169'  
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
          // 1. KPIs
          const stats = {
               total: lista.length,
               pendente: lista.filter(i => i.status === 'PENDENTE').length,
               analisando: lista.filter(i => i.status === 'ANALISANDO').length,
               resolvido: lista.filter(i => i.status === 'RESOLVIDO').length
          };
          setKpis(stats);

          // 2. Gráfico Status (Pizza)
          const statusData = [
               { name: 'Pendente', value: stats.pendente, color: COLORS_STATUS.PENDENTE },
               { name: 'Em Andamento', value: stats.analisando, color: COLORS_STATUS.ANALISANDO },
               { name: 'Resolvidos', value: stats.resolvido, color: COLORS_STATUS.RESOLVIDO }
          ].filter(item => item.value > 0);
          setGraficoStatus(statusData);

          // 3. Agrupamentos (Barras)
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

          // 4. Evolução Temporal (Linha)
          const timeMap = {};
          lista.forEach(oc => {
               const dataFormatada = new Date(oc.data_hora).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
               timeMap[dataFormatada] = (timeMap[dataFormatada] || 0) + 1;
          });

          const linhaData = Object.keys(timeMap)
               .sort((a, b) => {
                    const [dA, mA] = a.split('/');
                    const [dB, mB] = b.split('/');
                    return new Date(2025, mA - 1, dA) - new Date(2025, mB - 1, dB);
               })
               .map(key => ({ data: key, quantidade: timeMap[key] }));

          setGraficoLinha(linhaData);

          // 5. Heatmap
          const coords = lista
               .filter(oc => oc.localizacao_geo && oc.localizacao_geo.coordinates)
               .map(oc => ({
                    lat: oc.localizacao_geo.coordinates[1],
                    lng: oc.localizacao_geo.coordinates[0]
               }));
          setPontosMapa(coords);
     };

     const gerarRelatorioPDF = (tipoRelatorio) => {
          try {
               const doc = new jsPDF();
               const primaryColor = [108, 99, 255]; // Roxo
               const currentDate = new Date().toLocaleDateString('pt-BR');

               try {
                    doc.addImage(logoImg, 'PNG', 14, 10, 25, 25);
               } catch (e) { }

               doc.setFont("helvetica", "bold");
               doc.setFontSize(22);
               doc.setTextColor(45, 55, 72);
               doc.text("Sentinel", 45, 20);

               doc.setFontSize(10);
               doc.setFont("helvetica", "normal");
               doc.setTextColor(100);
               doc.text("Sistema de Gestão de Ocorrências e Monitoramento", 45, 26);

               doc.setDrawColor(...primaryColor);
               doc.setLineWidth(1);
               doc.line(14, 38, 196, 38);

               doc.setFontSize(16);
               doc.setFont("helvetica", "bold");
               doc.setTextColor(45, 55, 72);
               doc.text(`Relatório - ${tipoRelatorio}`, 14, 50);

               let colunas = [];
               let dadosFormatados = [];
               let dadosFiltrados = [...data]; 

               switch (tipoRelatorio) {
                    case 'Zonas Críticas': 
                         colunas = [['Zona / Setor', 'Qtd. Ocorrências', 'Último Registro']];
                         const countSetor = {};
                         const lastDateSetor = {};
                         dadosFiltrados.forEach(d => {
                              const setor = d.nome_setor || 'N/A';
                              countSetor[setor] = (countSetor[setor] || 0) + 1;
                              lastDateSetor[setor] = new Date(d.data_hora).toLocaleDateString();
                         });
                         dadosFormatados = Object.keys(countSetor).map(key => [
                              key, countSetor[key], lastDateSetor[key]
                         ]).sort((a, b) => b[1] - a[1]); 
                         break;

                    case 'Cronológico':
                         colunas = [['Data/Hora', 'Descrição', 'Setor', 'Status']];
                         dadosFormatados = dadosFiltrados
                              .sort((a, b) => new Date(b.data_hora) - new Date(a.data_hora)) 
                              .map(item => [
                                   new Date(item.data_hora).toLocaleString('pt-BR'),
                                   item.descricao.substring(0, 40) + '...',
                                   item.nome_setor || 'N/A',
                                   item.status
                              ]);
                         break;

                    case 'Pendências':
                         colunas = [['Descrição', 'Setor', 'Aberto em']];
                         dadosFormatados = dadosFiltrados
                              .filter(i => i.status !== 'RESOLVIDO') 
                              .sort((a, b) => new Date(a.data_hora) - new Date(b.data_hora)) 
                              .map(item => [
                                   item.descricao.substring(0, 40) + '...',
                                   item.nome_setor || 'N/A',
                                   new Date(item.data_hora).toLocaleDateString()
                              ]);
                         break;

                    case 'Categorias':
                         colunas = [['Categoria', 'Descrição', 'Status', 'Data']];
                         dadosFormatados = dadosFiltrados
                              .sort((a, b) => (a.nome_categoria || '').localeCompare(b.nome_categoria || ''))
                              .map(item => [
                                   item.nome_categoria || 'Geral',
                                   item.descricao.substring(0, 40) + '...',
                                   item.status,
                                   new Date(item.data_hora).toLocaleDateString()
                              ]);
                         break;

                    default: 
                         colunas = [['Status', 'Descrição', 'Setor', 'Categoria']];
                         dadosFormatados = dadosFiltrados.map(item => [
                              item.status,
                              item.descricao.substring(0, 40) + '...',
                              item.nome_setor || 'N/A',
                              item.nome_categoria || 'N/A'
                         ]);
               }

               doc.setFillColor(247, 250, 252);
               doc.roundedRect(14, 55, 182, 20, 3, 3, 'F');
               doc.setFontSize(10);
               doc.setFont("helvetica", "normal");
               doc.text(`Total de Registros Listados: ${dadosFormatados.length}`, 20, 68);
               doc.text(`Gerado em: ${currentDate}`, 150, 68);

               autoTable(doc, {
                    head: colunas,
                    body: dadosFormatados,
                    startY: 85,
                    theme: 'grid',
                    headStyles: { fillColor: primaryColor, fontStyle: 'bold' },
                    styles: { fontSize: 9, cellPadding: 3 },
                    alternateRowStyles: { fillColor: [249, 250, 251] },
                    didDrawPage: function (data) {
                         // Rodapé
                         const pageHeight = doc.internal.pageSize.height;
                         doc.setDrawColor(200);
                         doc.line(14, pageHeight - 15, 196, pageHeight - 15);
                         doc.setFontSize(8);
                         doc.text('Sentinel - Relatório Oficial', 14, pageHeight - 10);
                         doc.text('Página ' + doc.internal.getNumberOfPages(), 180, pageHeight - 10);
                    }
               });

               doc.save(`Relatorio_${tipoRelatorio.replace(/ /g, '_')}.pdf`);
          } catch (error) {
               console.error("Erro PDF:", error);
               alert("Erro ao gerar PDF.");
          }
     };

     if (loading) return <div className="loading-screen">Carregando Dashboard...</div>;

     return (
          <div className="dashboard-container">

               {/* Título */}
               <div className="dashboard-header-content">
                    <h1>Visão Geral</h1>
                    <p>Painel de controle e monitoramento do campus</p>
               </div>

               {/* KPI Cards */}
               <div className="kpi-grid">
                    <KpiCard title="Total" value={kpis.total} icon={FileText} color="purple" />
                    <KpiCard title="Pendentes" value={kpis.pendente} icon={Clock} color="yellow" />
                    <KpiCard title="Em Andamento" value={kpis.analisando} icon={Activity} color="blue" />
                    <KpiCard title="Resolvidos" value={kpis.resolvido} icon={CheckCircle} color="green" />
               </div>

               {/* Gráfico Temporal */}
               <div className="chart-card full-width">
                    <h3> Evolução Temporal (Últimos Registros)</h3>
                    <div className="chart-wrapper">
                         <ResponsiveContainer width="100%" height={300}>
                              <LineChart data={graficoLinha}>
                                   <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                   <XAxis dataKey="data" fontSize={12} tickLine={false} axisLine={false} />
                                   <YAxis allowDecimals={false} axisLine={false} tickLine={false} />
                                   <Tooltip />
                                   <Line type="monotone" dataKey="quantidade" stroke="#6c63ff" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                              </LineChart>
                         </ResponsiveContainer>
                    </div>
               </div>

               {/* Gráficos Pizza e Barra */}
               <div className="charts-row">
                    <div className="chart-card">
                         <h3>Status das Ocorrências</h3>
                         <div className="chart-wrapper">
                              <ResponsiveContainer width="100%" height={250}>
                                   <PieChart>
                                        <Pie data={graficoStatus} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                                             {graficoStatus.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                                        </Pie>
                                        <Tooltip />
                                        <Legend verticalAlign="bottom" />
                                   </PieChart>
                              </ResponsiveContainer>
                         </div>
                    </div>

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

               {/* Mapa de Calor */}
               <div className="chart-card full-width" style={{ padding: 0, overflow: 'hidden' }}>
                    <div style={{ padding: '1.5rem 1.5rem 0 1.5rem' }}>
                         <h3> Mapa de Calor (Zonas Críticas)</h3>
                    </div>
                    <div style={{ height: '400px', width: '100%', position: 'relative' }}>
                         <MapContainer center={[-20.398, -43.508]} zoom={15} style={{ height: '100%', width: '100%' }}>
                              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                              <HeatmapLayer points={pontosMapa} />
                         </MapContainer>
                    </div>
               </div>

               {/* Seção de Relatórios (Expandida) */}
               <div className="reports-section">
                    <h3> Central de Relatórios</h3>
                    <div className="reports-grid">

                         <ReportButton
                              icon={MapIcon}
                              label="Relatório de Zonas"
                              onClick={() => gerarRelatorioPDF('Zonas Críticas')}
                         />

                         <ReportButton
                              icon={Calendar}
                              label="Histórico Cronológico"
                              onClick={() => gerarRelatorioPDF('Cronológico')}
                         />

                         <ReportButton
                              icon={AlertTriangle}
                              label="Relatório de Pendências"
                              onClick={() => gerarRelatorioPDF('Pendências')}
                         />

                         <ReportButton
                              icon={Folder}
                              label="Análise por Categoria"
                              onClick={() => gerarRelatorioPDF('Categorias')}
                         />

                    </div>
               </div>

          </div>
     );
};

export default Dashboard;