const { Case } = require('../models');

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
            existsOrError(value.description,'Descrição não informada!')
            existsOrError(value.id_teacher,'Professor não informado!')
            //Insere o dado no banco de dados, caso de algum problema, lança uma exceção
            return Case.create(value)
           
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
            //Delete o caso
            const rowsDeleted = Case.destroy({
                where:{
                    id: value
                }
            })
          
            //Caso não encontrar o caso, gera uma exceção
            existsOrError(rowsDeleted, 'Caso não foi encontrada.')
            
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
            existsOrError(value.description,'Descrição não informada!')
            existsOrError(value.id_teacher,'Professor não informado!')

            //Update nos dados de acordo com o id
            Case.update({ 
                                name: value.name,
                                description: value.description,
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
           //Retorna todos os casos
           return Case.findAll()
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
            //Retorna o caso pelo id
            return Case.findAll({
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