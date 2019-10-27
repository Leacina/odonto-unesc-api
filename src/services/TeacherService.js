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
        return bcrypt.hashSync(password, salt);
    }

    /**
     * Valida os dados que serão inseridos
     * @param {Valor que será validado} value 
     */
    const store = async (value) => {
        try {
            const { name, email, code, manager, password, active } = value;

            //Verifica se o objeto passado esta correto
            existsOrError(value, 'Formato dos dados inválido');

            //Verifica se possui todos os dados foram passados
            existsOrError(name, 'Nome não informado!');
            existsOrError(code, 'Código não informado!');
            existsOrError(email, 'Email não informado!');
            existsOrError(password, 'Senha não informada!');
            existsOrError(active, 'Status não informado!');
            
            const encryptedPassword = encryptPassword(password);
          
            const teacher = await Teacher.findOne({
                where: {
                    code
                }
            });

            if (teacher) {
                throw  'Já existe um professor com mesmo código';
            }

            //Insere o dado no banco de dados, caso de algum problema, lança uma exceção
            return Teacher.create({
                name,
                code,
                email,
                password: encryptedPassword,
                manager,
                active
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
        try{
            //Delete o professor
            const rowsDeleted = Teacher.destroy({
                where:{
                    id: value
                }
            });
          
            //Caso não encontrar o professor, gera uma exceção
            existsOrError(rowsDeleted, 'Professor não foi encontrada.');
            
            return rowsDeleted;
        } catch(err) {
            throw err;
        }

    }

    /**
     * Valida os dados que serão alterados
     * @param {Valor que será validado} value 
     */
    const update = async (value) => {
        try {
            const { id, name, email, code, manager, password } = value;

            //Verifica se o objeto passado esta correto
            existsOrError(value,'Formato dos dados inválido');

            //Verifica se possui todos os dados foram passados
            existsOrError(name, 'Nome não informado!');
            existsOrError(email, 'Email não informado!');
            existsOrError(code, 'Código não informado!');
            existsOrError(password, 'Senha não informada!');
            existsOrError(active, 'Status não informado!');
            
            // TODO: Temos um erro grave de segurança aqui!!!!
            // A senha não deve ser transportada na edição
            // A não ser que se deseje alterá-la, mas o ideal era usar uma lógica
            // que só alteraria a senha se a mesma fosse informada. E nesse caso ela seria criptografada novamente

            // TODO: Falta uma lógica para verificar a duplicidade do código na edição
            
            //Update nos dados de acordo com o id
            Teacher.update({ 
                name,
                code,
                email,
                password,
                manager,
                active
            }, {
                where: {
                    id: id
                }
            });
        } catch(err) {
            throw err;
        }
    }

    /**
    * Valida os dados que serão retornados
    * @param {Valor que será validado} value 
    */
    const index = async () => {
        try {
           //Retorna todos os professores
           // TODO: Temos um erro grave de segurança aqui!!!!
           // Está sendo retornado a lista dos professores com suas respectivas senhas
           return Teacher.findAll();
        } catch(err) {
            throw err;
        }
    }

    /**
    * Valida os dados que serão retornados
    * @param {Valor que será validado} value 
    */
   const show = async (value) => {
        try{
            //Retorna o professor pelo id
            // TODO: Temos um erro grave de segurança aqui!!!!
            // Está sendo retornado a lista dos professores com suas respectivas senhas
            return Teacher.findAll({
                where:{
                    id: value
                }
            });
        } catch(err) {
            throw err;
        }
    }

    return {store, destroy, show, index, update, encryptPassword}
}