const Sequelize = require('sequelize'); //Requisitando pacote para utilizar bancos RELACIONAIS com o Node.js. Todas operações com o bando de dados é feita pelo sequelize.

const sequelize = new Sequelize({ //Instanciar um sequelize
    dialect: 'sqlite', //qual banco que vamos utilizar
    storage: './db/app.db' //onde está o banco. Nesse caso é nessa pasta mesmo.
});

module.exports = sequelize //Como o arquivo do banco é externo ao app.js, precisamos realizar um apontamento para exportação desse arquivo para conexão.
//Quando queremos utilizar algum arquivo que esteja FORA do app.js, utilizamos o module.exports. Logo, o sequelize vai ser importanto no app.js através
//do connection.