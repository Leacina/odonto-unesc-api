module.exports = {
  up: (queryInterface, Sequelize) => { return queryInterface.bulkInsert('Teacher', 
    [{
        name: 'Administrador',
        code: 99497,
        password: '$2a$10$cRnf.WPvqq16MjV2qhJDXu6b.OBDpHxRAAJegnOxOfX0MHyeLX5rG',
        createdAt:new Date(),
        updatedAt:new Date(),
        active:1,
        manager:1,
        email:"unidonto@unesc.net",
    }], {});
    },
  down: (queryInterface) => queryInterface.bulkDelete('Teacher', null, {}),
};