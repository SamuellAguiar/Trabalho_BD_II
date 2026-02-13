import React from 'react';
import { Upload } from 'lucide-react';
import './FormComponents.css';

export const FormGroup = ({ label, required, children, error }) => (
     <div className="form-group">
          <label className="form-label">
               {label} {required && <span className="required">*</span>}
          </label>
          {children}
          {error && <span className="form-error">{error}</span>}
     </div>
);

export const TextArea = ({ placeholder, ...props }) => (
     <textarea className="form-input textarea" placeholder={placeholder} {...props} />
);

export const Select = ({ options, placeholder, value, onChange, ...props }) => (
     <select className="form-input select" value={value} onChange={onChange} {...props}>
          <option value="" disabled>{placeholder}</option>
          {options.map((opt) => (
               <option key={opt._id} value={opt._id}>
                    {opt.nome}
               </option>
          ))}
     </select>
);

export const Input = ({ icon: Icon, placeholder, value, onChange, ...props }) => (
     <div className="input-wrapper">
          {Icon && <div className="input-icon"><Icon size={18} /></div>}
          <input
               type="text"
               className={`form-input text-input ${Icon ? 'has-icon' : ''}`}
               placeholder={placeholder}
               value={value}
               onChange={onChange}
               {...props}
          />
     </div>
);

export const FileUploadArea = ({ onFileSelect, filesCount }) => {
     return (
          <div className="upload-area">
               <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={onFileSelect}
                    id="file-upload"
                    className="file-input-hidden"
               />
               <label htmlFor="file-upload" className="upload-label">
                    <div className="upload-icon-circle">
                         <Upload size={24} color="#718096" />
                    </div>
                    <span className="upload-text">
                         {filesCount > 0
                              ? `${filesCount} arquivo(s) selecionado(s)`
                              : "Clique para selecionar arquivos ou arraste e solte"}
                    </span>
                    <span className="btn-upload-trigger">Selecionar Arquivos</span>
               </label>
          </div>
     );
};