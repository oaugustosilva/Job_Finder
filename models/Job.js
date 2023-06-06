const Sequelize = require('sequelize');
const db = require('../db/connection'); //quando chama Sequelize, precisa conectar no bando de dados, e aqui mostramos qual é.


//VERIFICAR, POIS ACHO QUE O MODELO NÃO ESTÁ IGUAL À TABELA. PRECISA ESTAR IGUAL À TABELA DO BD. LOGO, VOU ADEQUAR A TABELA.

const Job = db.define('job', { //Criando o modelo através do método define, do objeto db.
    title: {
        type: Sequelize.STRING,
    },
    description: {
        type: Sequelize.STRING,
    },
    salary: {
        type: Sequelize.STRING,
    },
    company: {
        type: Sequelize.STRING,
    },
    email: {
        type: Sequelize.STRING,
    },
    new_job: { //FLAG para sinalizar se o job é novo ou não (0 ou 1).
        type: Sequelize.INTEGER,
    }
});

module.exports = Job //exportando, para poder utilizar onde preferirmos.