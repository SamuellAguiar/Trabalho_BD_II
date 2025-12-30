const ocorrenciaSchema = {
     descricao: {
          required: true,
          minLength: 10
     },
     setorId: { required: true },
     categoriaId: { required: true },
     lat: { required: true },
     lng: { required: true }
};

module.exports = ocorrenciaSchema;