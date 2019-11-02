const { Teacher } = require('../models');
const { authSecret } = require('../.env')
const jwt = require('jwt-simple')
const bcrypt = require('bcrypt-nodejs')
const Sequelize = require('sequelize')

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
    const store = async (body, headers) => {
        try {
            const { name, email, code, manager, password, active } = body;

            //Verifica se o objeto passado esta correto
            existsOrError(body, 'Formato dos dados inválido');

            //Verifica se possui todos os dados foram passados
            existsOrError(name, 'Nome não informado!');
            existsOrError(code, 'Código não informado!');
            existsOrError(email, 'Email não informado!');
            existsOrError(password, 'Senha não informada!');
            
            const _token = jwt.decode(headers.authorization.replace('Bearer','').trim(), authSecret);
      
            //Verifica se pode alterar... Somente altera quem se for manager
            if(!(_token.type == 'manager') && manager) {
                throw {
                    erro:'Usuário não possui permissão para cadastro de manager',
                    status:403
                }
            }

            //Criptografa a senha
            const encryptedPassword = encryptPassword(password);
            
            //Busca o professor caso ja exista
            const teacher = await Teacher.findOne({
                where: {
                    code
                }
            });

            //Se existir... Lança exceção
            if (teacher) {
                throw  {
                            erro:'Já existe um professor com mesmo código',
                            status:400
                };
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
            
            const { name, active, email, code, password, manager} = body;
            const { id } = params

            //Verifica se o objeto passado esta correto
            existsOrError(body,'Formato dos dados inválido');

            //Verifica se possui todos os dados foram passados
            existsOrError(id, 'Campo ID não informado!');
            existsOrError(name, 'Nome não informado!');
            existsOrError(email, 'Email não informado!');
            existsOrError(code, 'Código não informado!');
            
            const _token = jwt.decode(headers.authorization.replace('Bearer','').trim(), authSecret);
          
            if(_token.id == id || _token.type == 'manager') {
                
                if(!(_token.type == 'manager') && ((typeof manager !== 'undefined') || (typeof active !== 'undefined'))){
                    throw   {
                                erro:'Você não possui permissão para alterar campos manager/active',
                                status:403
                            }
                }

                var teacher

                //Se a senha foi passada... Verifica se pode alterar
                if(password){
                    //Update nos dados de acordo com o id
                    const encryptedPassword = encryptPassword(password)
            
                    teacher = { name, code, email, password : encryptedPassword, manager, active }

                    //Retorna professor alterado
                    return Teacher.update(teacher, 
                    {   
                        where: {
                            id
                        }
                    }); 
                }//Verifico se é o mesmo usuário logado
                else{
                    teacher = { name, code, email, manager, active }
                
                    //Se não passou a senha...
                    return Teacher.update({ name, code, email}, 
                        {   
                            where: {
                                id
                            }
                        });
                }
            }else{
                throw   {
                            erro:'Usuário não possui permissão para alterar os dados!',
                            status:403
                        }
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
           //Pega os dados para filtros 
           const { sort, order, page, limit, search } = query     
            
           //Utilizado nos filtros
           const Op = Sequelize.Op 

           //Retorna todos os professores
           return Teacher.findAll({
                //Busca os dados com todos os filtros
                attributes: ['id','name', 'code', 'email', 'manager', 'active'], 
                where:{
                [Op.or]: [
                    {
                        name: {
                            [Op.like]: `%${search || ''}%`
                        }
                    },
                    {
                        code: {
                            [Op.like]: `%${search || ''}%`
                        }
                    },
                    {
                        email:{
                            [Op.like]: `%${search || ''}%`  
                        }
                    }
                ]},
                limit: parseInt(limit) || null,
                offset: parseInt(page) || null,
                order: [[sort || 'id',order || 'ASC']]
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