const { Teacher } = require('../models');
const bcrypt = require('bcrypt-nodejs')

module.exports = app => {
    const {existsOrError} = app.src.services.ValidationService;

    /**
     * Responsavel por criptografar as senhas
     * @param {senha} password 
     */
    const encryptPassword = password => {
        const salt = bcrypt.genSaltSync(10)
        return bcrypt.hashSync(password,salt)
    }

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
            existsOrError(value.password,'Senha não informada!')
            
            value.password = encryptPassword(value.password)
          
            //Insere o dado no banco de dados, caso de algum problema, lança uma exceção
            return Teacher.create(value)
           
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
            //Delete o professor
            const rowsDeleted = Teacher.destroy({
                where:{
                    id: value
                }
            })
          
            //Caso não encontrar o professor, gera uma exceção
            existsOrError(rowsDeleted, 'Professor não foi encontrada.')
            
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
            Teacher.update({ 
                                name: value.name,
                                code: value.code,
                                password: value.password,
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
           //Retorna todos os professores
           return Teacher.findAll()
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
            //Retorna o professor pelo id
            return Teacher.findAll({
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