const validateSchema = (schema) => {
     return (req, res, next) => {
          const errors = [];

          const data = req.body;

          for (const field in schema) {
               const rules = schema[field];

               // Valida campo obrigatório
               if (rules.required && !data[field]) {
                    errors.push(`O campo '${field}' é obrigatório.`);
                    continue; 
               }

               // Valida tamanho mínimo 
               if (data[field] && rules.minLength && data[field].length < rules.minLength) {
                    errors.push(`O campo '${field}' deve ter no mínimo ${rules.minLength} caracteres.`);
               }
          }

          if (errors.length > 0) {
               return res.status(400).json({ erros: errors });
          }

          next(); 
     };
};

module.exports = validateSchema;