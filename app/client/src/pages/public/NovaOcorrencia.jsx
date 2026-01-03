import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Send } from 'lucide-react';
import api from '../../services/api';
import './NovaOcorrencia.css';

// Componentes UI
import { FormGroup, TextArea, Select, FileUploadArea } from '../../components/ui/FormComponents';
import Button from '../../components/ui/Button';

const NovaOcorrencia = () => {
     const navigate = useNavigate();

     // Estados do Formulário
     const [descricao, setDescricao] = useState('');
     const [setorId, setSetorId] = useState('');
     const [categoriaId, setCategoriaId] = useState('');
     const [arquivos, setArquivos] = useState([]);

     // Estados de Localização
     const [location, setLocation] = useState({ lat: null, lng: null });
     const [locStatus, setLocStatus] = useState('idle'); // idle, loading, success, error

     // Estados de Dados (Vindos do Back)
     const [setores, setSetores] = useState([]);
     const [categorias, setCategorias] = useState([]);

     // Estado de Carregamento Geral
     const [submitting, setSubmitting] = useState(false);

     // 1. Carregar Metadados ao abrir a tela
     useEffect(() => {
          api.get('/metadados')
               .then(response => {
                    setSetores(response.data.setores);
                    setCategorias(response.data.categorias);
               })
               .catch(err => console.error("Erro ao carregar dados:", err));
     }, []);

     // 2. Função para capturar GPS
     const handleCaptureLocation = () => {
          setLocStatus('loading');
          if (!navigator.geolocation) {
               alert("Seu navegador não suporta geolocalização.");
               setLocStatus('error');
               return;
          }

          navigator.geolocation.getCurrentPosition(
               (position) => {
                    setLocation({
                         lat: position.coords.latitude,
                         lng: position.coords.longitude
                    });
                    setLocStatus('success');
               },
               (error) => {
                    console.error(error);
                    alert("Erro ao obter localização. Permita o acesso ao GPS.");
                    setLocStatus('error');
               }
          );
     };

     // 3. Função de Upload de Arquivos
     const handleFileChange = (e) => {
          setArquivos(e.target.files);
     };

     // 4. Enviar Formulário
     const handleSubmit = async (e) => {
          e.preventDefault();

          // Validação Básica
          if (!location.lat || !location.lng) {
               alert("Por favor, capture a localização antes de enviar.");
               return;
          }
          if (!descricao || !setorId || !categoriaId) {
               alert("Preencha todos os campos obrigatórios.");
               return;
          }

          setSubmitting(true);

          try {
               // Montar o FormData (Obrigatório para envio de arquivos)
               const formData = new FormData();
               formData.append('descricao', descricao);
               formData.append('setorId', setorId);
               formData.append('categoriaId', categoriaId);
               formData.append('lat', location.lat);
               formData.append('lng', location.lng);

               // Adicionar arquivos (loop pois é multiple)
               for (let i = 0; i < arquivos.length; i++) {
                    formData.append('fotos', arquivos[i]);
               }

               // Enviar para o Back-end
               await api.post('/ocorrencias', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
               });

               alert("Ocorrência registrada com sucesso!");
               navigate('/lista'); // Redireciona para a lista
          } catch (error) {
               console.error(error);
               const msg = error.response?.data?.erro || "Erro ao registrar.";
               alert(msg);
          } finally {
               setSubmitting(false);
          }
     };

     return (
          <div className="nova-ocorrencia-wrapper centered-content">
               <div className="form-card">

                    <header className="form-header">
                         <h2>Registrar Nova Ocorrência</h2>
                         <p>Preencha o formulário abaixo com os detalhes da ocorrência</p>
                    </header>

                    <form onSubmit={handleSubmit}>
                         {/* Descrição */}
                         <FormGroup label="Descrição" required>
                              <TextArea
                                   placeholder="Descreva a ocorrência com o máximo de detalhes possível..."
                                   value={descricao}
                                   onChange={e => setDescricao(e.target.value)}
                              />
                         </FormGroup>

                         {/* Linha Dupla: Categoria e Setor */}
                         <div className="form-row">
                              <FormGroup label="Categoria" required>
                                   <Select
                                        placeholder="Selecione..."
                                        options={categorias}
                                        value={categoriaId}
                                        onChange={e => setCategoriaId(e.target.value)}
                                   />
                              </FormGroup>

                              <FormGroup label="Setor" required>
                                   <Select
                                        placeholder="Selecione..."
                                        options={setores}
                                        value={setorId}
                                        onChange={e => setSetorId(e.target.value)}
                                   />
                              </FormGroup>
                         </div>

                         {/* Upload */}
                         <FormGroup label="Anexos (Fotos, Documentos)">
                              <FileUploadArea onFileSelect={handleFileChange} filesCount={arquivos.length} />
                         </FormGroup>

                         {/* Geolocalização */}
                         <FormGroup label="Geolocalização" required>
                              <button
                                   type="button"
                                   className={`btn-geo ${locStatus}`}
                                   onClick={handleCaptureLocation}
                              >
                                   <MapPin size={18} />
                                   {locStatus === 'success' ? 'Localização Capturada!' :
                                        locStatus === 'loading' ? 'Obtendo GPS...' : 'Capturar Localização'}
                              </button>
                              {locStatus === 'success' && (
                                   <span className="geo-info">Lat: {location.lat.toFixed(4)}, Lng: {location.lng.toFixed(4)}</span>
                              )}
                         </FormGroup>

                         {/* Botões de Ação */}
                         <div className="form-actions">
                              <Button type="submit" variant="solid" disabled={submitting}>
                                   {submitting ? 'Enviando...' : <><Send size={18} style={{ marginRight: 8 }} /> Registrar Ocorrência</>}
                              </Button>

                              <button type="button" className="btn-cancel" onClick={() => navigate('/')}>
                                   Cancelar
                              </button>
                         </div>

                    </form>
               </div>
          </div>
     );
};

export default NovaOcorrencia;