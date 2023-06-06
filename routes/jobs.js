const express = require('express'); //Vai cuidar da parte de rotas.
const router  = express.Router(); //Objeto de rotas
const Job     = require('../models/Job'); //Modelo para modificar nosso BD

/* Testando o código de rotas apenas com essa parte abaixo. Abre terminal > npm run dev > abre o Postman > Digitar o que está na linha abaixo:

localhost:3000/jobs/test. Com isso, vai testar as linhas abaixo.

*/
router.get('/test', (req, res) => {
    res.send('deucertin');
});

/* Fim da rotina de teste de rota. */

//Form da Rota para abrir a vaga
router.get('/view/:id', (req, res) => Job.findOne({
        where: { id: req.params.id }
    }).then(job => {

        res.render('view', {
            job
        });
    }).catch(err => console.log(err))
); //onde o ID é o ID da vaga... vai ficar -> /view/1, /view/2...
//Fim da rota de abrir a vaga.

//Form da Rota de envio da vaga
router.get('/add', (req, res) => {
    res.render('add');
});

//add job via post no site
router.post('/add', (req, res) => {
    
    //Quando vamos receber dados seja de um formulário ou post, vamos receber um corpo, por isso o body-parse. Esse corpo vai ter todas as informações de acordo com
    //o nosso modelo. A gente vai requisitar através do req.body. Para isso, o body parser precisa estar requisitado lá no app.

    //NÃO ESTÁ NA ORDEM DE ACORDO COM O MODELO. PRECISA ESTAR NA ORDEM???
    let {title, salary, company, description, email, new_job} = req.body;
    //res.send('Rota de post ok!'); apenas para teste. No oficial deve retornar para a home devido a linha de redirect com / ali embaixo.
    //insert: inserindo dados através do post.
    Job.create({
        title,
        description,
        salary,
        company,
        email,
        new_job
    })
    .then(() => res.redirect('/')) //Ao adicionar a vaga via post, a página será redirecionada para home.
    .catch(err => console.log(err)); //Sinalizar caso haja erro.
});
//Agora temos a rotina para criar posts, porém, no arquivo app.js, precisamos identificar que essa rota vai ser utilizada para criar jobs via posts, então
//nós vamos lá no app e sinalizamos que vamos utilizar as rotas /jobs para utilizar o modelo Job para criar, ler, atualiazr e deletar (CRUD) os jobs.


module.exports = router //Exportando rotas para utilizar o arquivo fora dessa pasta.