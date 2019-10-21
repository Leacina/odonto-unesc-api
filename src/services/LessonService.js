const { Lesson } = require('../models');

module.exports = app => {
    const {existsOrError} = app.src.services.ValidationService;

    /**
     * Valida os dados que serão inseridos
     * @param {Valor que será validado} value 
     */
    const valideStore = async (value) => {
        
        try{
            
            //Verifica se o objeto passado esta correto
            existsOrError(value,'Formato dos dados invalido')

            //Verifica se possui todos os dados foram passados
            existsOrError(value.name,'Nome não informado!')
            existsOrError(value.code,'Código não informado!')
            existsOrError(value.expiration_date,'Data de expiração não informada!')
            existsOrError(value.start_date,'Data de inicio não informada!')
            existsOrError(value.id_teacher,'Professor não informado!')
            
            //Insere o dado no banco de dados, caso de algum problema, lança uma exceção
            return Lesson.create(value)
           
        }catch(err){
            //Se houver algum dado incorreto, lança exceção para o controller
            //com a mensagem de erro ja tratada.
            throw err
        }

    }

    /**
     * Valida os dados que serão deletados
     * @param {Valor que será validado} value 
     */
    const valideDestroy = async (value) => {

        try{
            //Delete a lição
            const rowsDeleted = Lesson.destroy({
                where:{
                    id: value
                }
            })
          
            //Caso não encontrar o lição, gera uma exceção
            existsOrError(rowsDeleted, 'Atividade não foi encontrada.')
            
            return rowsDeleted
        }catch(err){
            throw err
        }

    }

    /**
     * Valida os dados que serão alterados
     * @param {Valor que será validado} value 
     */
    const valideUpdate = async (value) => {

        try{
            //Verifica se o objeto passado esta correto
            existsOrError(value,'Formato dos dados invalido')

            //Verifica se possui todos os dados foram passados
            existsOrError(value.name,'Nome não informado!')
            existsOrError(value.code,'Código não informado!')
            existsOrError(value.password,'Senha não informada!')

            //Update nos dados de acordo com o id
            Lesson.update({ 
                                name: value.name,
                                code: value.code,
                                expiration_date: value.expiration_date,
                                start_date: value.start_date,
                                id_teacher: value.id_teacher,
                           }, 
            {
                where: {
                  id: value.id
                }
            })

        }catch(err){
            throw err
        }
    }

    /**
    * Valida os dados que serão retornados
    * @param {Valor que será validado} value 
    */
    const valideIndex = async () => {

        try{
           //Retorna todos as lição
           return Lesson.findAll()
        }catch(err){
            throw err
        }

    }

    /**
    * Valida os dados que serão retornados
    * @param {Valor que será validado} value 
    */
   const valideShow = async (value) => {
        try{
            //Retorna a lição pelo id
            return Lesson.findAll({
                where:{
                    id:value
                }
            })
        }catch(err){
            throw err
        }
    }

    return {valideStore, valideDestroy, valideShow, valideIndex, valideUpdate}
}