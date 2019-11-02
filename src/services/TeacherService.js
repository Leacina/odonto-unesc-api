const { Teacher } = require('../models');
const { authSecret } = require('../.env')
const jwt = require('jwt-simple')
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
            existsOrError(rowsDeleted, 'Professor não foi encontrado.');
            
            return rowsDeleted;
        } catch(err) {
            throw err;
        }

    }

    /**
     * Valida os dados que serão alterados
     * @param {Valor que será validado} value 
     */
    const update = async (body, headers, params) => {
        try {   
            
            const { name, active,email, code, password} = body;
            const { id } = params

            //Verifica se o objeto passado esta correto
            existsOrError(body,'Formato dos dados inválido');

            //Verifica se possui todos os dados foram passados
            existsOrError(id, 'Campo ID não informado!');
            existsOrError(name, 'Nome não informado!');
            existsOrError(email, 'Email não informado!');
            existsOrError(code, 'Código não informado!');
            existsOrError(active, 'Status não informado!');
         
            const _token = jwt.decode(headers.authorization.replace('Bearer','').trim(), authSecret);
          
            if(_token.id == id || _token.type == 'manager') {
                //Se a senha foi passada... Verifica se pode alterar
                if(password){
                    //Update nos dados de acordo com o id
                    const encryptedPassword = encryptPassword(password);
                    var teacher

                    if (_token.type == 'manager'){
                        //TODO: Verificar se passou manager e retornar erro

                        teacher = { name, code, email, password : encryptedPassword, manager, active }
                    }else{
                        teacher = { name, code, email, password : encryptedPassword } 
                    }
                
                    //Retorna professor alterado
                    return Teacher.update(teacher, 
                    {   
                        where: {
                            id
                        }
                    }); 
                }//Verifico se é o mesmo usuário logado
                else{
                    //Se não passou a senha...
                    return Teacher.update({ name, code, email}, 
                        {   
                            where: {
                                id
                            }
                        });
                }
            }else{
                throw 'Usuário não possui permissão para alterar a senha!'
            }     
        } catch(err) {
            throw err;
        }
    }

    /**
    * Valida os dados que serão retornados
    * @param {Valor que será validado} value 
    */
    const index = async (query) => {
        try {
           const { sort, order, page, limit, search } = query     

           //Retorna todos os professores
           return Teacher.findAll({
                attributes: ['id','name', 'code', 'email', 'manager', 'active'], 
                limit: parseInt(limit) || null,
                offset: parseInt(page) || null, 
                order: [[order || 'id','ASC']],
                //TODO: Ajustar Where
                /*
                where: {
                    [Op.or]: [
                      { name: { [Op.ilike]: '%someval%' } },
                      { code: { [Op.ilike]: '%someval%' } }
                    ]
                  }
                */
           });
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
            return Teacher.findOne({
                where:{
                    id: value
                },
                attributes: ['id','name', 'code', 'email', 'manager', 'active']
            });
        } catch(err) {
            throw err;
        }
    }

    return {store, destroy, show, index, update, encryptPassword}
}