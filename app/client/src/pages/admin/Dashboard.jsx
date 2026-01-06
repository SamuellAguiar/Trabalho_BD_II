import { useEffect, useState } from 'react';
import {
     BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
     PieChart, Pie, Cell, Legend
} from 'recharts';
import { FileText, Clock, Activity, CheckCircle, FileBarChart, Folder, Map as MapIcon } from 'lucide-react';
import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

// Bibliotecas de PDF
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

import api from '../../services/api';
import './Dashboard.css';

// Componentes UI Reutilizáveis
import KpiCard from '../../components/ui/KpiCard';
import ReportButton from '../../components/ui/ReportButton';
import HeatmapLayer from '../../components/ui/HeatmapLayer'; // Componente criado anteriormente

const Dashboard = () => {
     const [loading, setLoading] = useState(true);
     const [data, setData] = useState([]);

     // Estados para KPIs
     const [kpis, setKpis] = useState({ total: 0, pendente: 0, analisando: 0, resolvido: 0 });

     // Estados para Gráficos
     const [graficoStatus, setGraficoStatus] = useState([]);
     const [graficoCategoria, setGraficoCategoria] = useState([]);
     const [graficoSetor, setGraficoSetor] = useState([]);
     const [graficoLinha, setGraficoLinha] = useState([]); // Tendência Temporal
     const [pontosMapa, setPontosMapa] = useState([]);     // Dados do Heatmap

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

          // 2. Gráfico de Status (Pizza)
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

          // 3. Processar Padrão Temporal (Gráfico de Linha)
          const timeMap = {};
          lista.forEach(oc => {
               // Formata data como DD/MM
               const dataFormatada = new Date(oc.data_hora).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
               timeMap[dataFormatada] = (timeMap[dataFormatada] || 0) + 1;
          });

          // Ordena cronologicamente
          const linhaData = Object.keys(timeMap)
               .sort((a, b) => {
                    const [dA, mA] = a.split('/');
                    const [dB, mB] = b.split('/');
                    return new Date(2025, mA - 1, dA) - new Date(2025, mB - 1, dB);
               })
               .map(key => ({ data: key, quantidade: timeMap[key] }));

          setGraficoLinha(linhaData);

          // 4. Processar Mapa de Calor
          const coords = lista
               .filter(oc => oc.localizacao_geo && oc.localizacao_geo.coordinates)
               .map(oc => ({
                    lat: oc.localizacao_geo.coordinates[1],
                    lng: oc.localizacao_geo.coordinates[0]
               }));
          setPontosMapa(coords);
     };

     // --- FUNÇÃO GERAR PDF ---
     const gerarRelatorioPDF = (tipoAgrupamento) => {
          try {
               const doc = new jsPDF();

               // Cabeçalho
               doc.setFontSize(18);
               doc.text(`Relatório de Ocorrências - Por ${tipoAgrupamento}`, 14, 22);
               doc.setFontSize(10);
               doc.text(`Gerado em: ${new Date().toLocaleDateString()}`, 14, 30);

               // Dados da Tabela
               const dadosTabela = data.map(item => [
                    item.descricao.substring(0, 40) + (item.descricao.length > 40 ? '...' : ''),
                    item.nome_setor || 'N/A',
                    item.nome_categoria || 'N/A',
                    item.status,
                    new Date(item.data_hora).toLocaleDateString()
               ]);

               // Gerar Tabela
               autoTable(doc, {
                    head: [['Descrição', 'Setor', 'Categoria', 'Status', 'Data']],
                    body: dadosTabela,
                    startY: 35,
                    headStyles: { fillColor: [108, 99, 255] },
                    styles: { fontSize: 8 },
                    alternateRowStyles: { fillColor: [245, 245, 255] }
               });

               doc.save(`relatorio_${tipoAgrupamento.toLowerCase()}.pdf`);
          } catch (error) {
               console.error("Erro ao gerar PDF:", error);
               alert("Erro ao gerar PDF.");
          }
     };

     if (loading) return <div className="loading-screen">Carregando Dashboard...</div>;

     return (
          <div className="dashboard-container">

               {/* Título da Página */}
               <div className="dashboard-header-content">
                    <h1>Visão Geral</h1>
                    <p>Acompanhe os indicadores e geolocalização do campus</p>
               </div>

               {/* --- KPI CARDS (4 Colunas) --- */}
               <div className="kpi-grid">
                    <KpiCard title="Total" value={kpis.total} icon={FileText} color="purple" />
                    <KpiCard title="Pendentes" value={kpis.pendente} icon={Clock} color="yellow" />
                    <KpiCard title="Em Andamento" value={kpis.analisando} icon={Activity} color="blue" />
                    <KpiCard title="Resolvidos" value={kpis.resolvido} icon={CheckCircle} color="green" />
               </div>

               {/* --- LINHA NOVA: EVOLUÇÃO TEMPORAL --- */}
               <div className="chart-card full-width">
                    <h3>📈 Evolução de Relatos (Últimos dias)</h3>
                    <div className="chart-wrapper">
                         <ResponsiveContainer width="100%" height={300}>
                              <LineChart data={graficoLinha}>
                                   <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                   <XAxis dataKey="data" fontSize={12} tickLine={false} axisLine={false} />
                                   <YAxis allowDecimals={false} axisLine={false} tickLine={false} />
                                   <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }} />
                                   <Line
                                        type="monotone"
                                        dataKey="quantidade"
                                        stroke="#6c63ff"
                                        strokeWidth={3}
                                        dot={{ r: 4, fill: '#6c63ff', strokeWidth: 2, stroke: '#fff' }}
                                        activeDot={{ r: 6 }}
                                   />
                              </LineChart>
                         </ResponsiveContainer>
                    </div>
               </div>

               {/* --- LINHA DE GRÁFICOS (Pizza e Barras) --- */}
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

                    {/* Gráfico Barras (Categorias) */}
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

               {/* --- LINHA NOVA: MAPA DE CALOR --- */}
               <div className="chart-card full-width" style={{ padding: 0, overflow: 'hidden' }}>
                    <div style={{ padding: '1.5rem 1.5rem 0 1.5rem' }}>
                         <h3>🔥 Mapa de Calor (Áreas Críticas)</h3>
                    </div>
                    <div style={{ height: '400px', width: '100%', position: 'relative' }}>
                         <MapContainer
                              center={[-20.398, -43.508]} // ATENÇÃO: Coloque aqui a Lat/Lng central da sua Universidade/Cidade
                              zoom={14}
                              style={{ height: '100%', width: '100%' }}
                         >
                              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                              <HeatmapLayer points={pontosMapa} />
                         </MapContainer>
                    </div>
               </div>

               {/* --- GRÁFICO DE SETORES --- */}
               <div className="chart-card full-width">
                    <h3>Ocorrências por Setor</h3>
                    <div className="chart-wrapper">
                         <ResponsiveContainer width="100%" height={300}>
                              <BarChart data={graficoSetor}>
                                   <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                   <XAxis dataKey="name" fontSize={11} tickLine={false} axisLine={false} />
                                   <YAxis allowDecimals={false} axisLine={false} tickLine={false} />
                                   <Tooltip cursor={{ fill: '#f7fafc' }} />
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
                         <ReportButton icon={MapIcon} label="Relatório Setores" onClick={() => gerarRelatorioPDF('Setor')} />
                    </div>
               </div>

          </div>
     );
};

export default Dashboard;