const { Video } = require('../models');
//const bcrypt = require('bcrypt-nodejs')

module.exports = app => {
    const {existsOrError} = app.src.services.ValidationService;

    /**
     * Valida os dados que serão inseridos
     * @param {Valor que será validado} value 
     */
    const store = async (value) => {
        try {
            const { url, is_active} = value.headers;
     
            //Verifica se o objeto passado esta correto
            existsOrError(value, 'Formato dos dados inválido');

            //Verifica se possui todos os dados foram passados
            existsOrError(url, 'Nome não informado!');
                  
            const video = await Video.findOne({
                where: {
                    url
                }
            });

            if (video) { throw  'Já existe um video com mesmo nome'; }

            //Insere o dado no banco de dados, caso de algum problema, lança uma exceção
            return Video.create({
                url,
                is_active
            });
           
        } catch(err) {
            //Se houver algum dado incorreto, lança exceção para o controller
            //com a mensagem de erro ja tratada.
            throw err;
        }
    }

    /**
     * Valida os dados que serão deletados
     * @param {Valor que será validado} value 
     */
    const destroy = async (value) => {
       

    }

    /**
     * Valida os dados que serão alterados
     * @param {Valor que será validado} value 
     */
    const update = async (value) => {
       
    }

    /**
    * Valida os dados que serão retornados
    * @param {Valor que será validado} value 
    */
    const show = async (value) => {
        
    }

    return {store, destroy, show, update}
}