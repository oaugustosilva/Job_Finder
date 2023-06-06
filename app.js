const express    = require('express'); //Requisitando o framework
const exphbs     = require('express-handlebars'); //Requisitndo o HandleBars. Para conectar as páginas e o back-end delas.
const app        = express(); //Invocando o express para criar o servidor
const path       = require('path'); //Utilizando pacote nativo do Node, chamado Path. Para facilitar os caminhos para as páginas.
const db         = require('./db/connection'); //Vai puxar o arquivo para conexão com banco de dados (por causa do module.export).
const bodyParser = require('body-parser');
const Job        = require('./models/Job');
const Sequelize  = require('sequelize');
const Op         = Sequelize.Op; //pacote do sequelize utilizado para fazer consultas mais complexas, como palavras chave.

const PORT = 3000; //Declarando a porta do servidor em uma variável

app.listen(PORT, function(){ //o App (Express) vai escutar uma porta do servidor, que nesse caso é a PORT.
    console.log(`O Express está rodando na porta: ${PORT}`); //Linha criada apenas para ilustrar que está escutando.
});

//body parser
app.use(bodyParser.urlencoded({ extended: false})); //Utilizando body-parser no projeto.

//handle-bars
app.set('views', path.join(__dirname, 'views')); //Duas underlines. Serve para orientar o diretório das nossas views (templates)
app.engine('handlebars', exphbs.engine({defaultLayout: 'main'})); //Orientar qual é o arquivo principal do layout (nesse caso o main).
app.set('view engine', 'handlebars');

//static folder > é a parte estática que se repete nas páginas (cabeçalho)
app.use(express.static(path.join(__dirname, 'public'))); //Orientando qual é o caminho para as views do site.

//Db Connection > parte dedicada à conexão com BD.
db
    .authenticate() //isso retorna uma promise, e podemos ter um "acerto" e um erro.
    .then(() => {
        console.log("Conectou ao banco com sucesso.");
    })
    .catch(err => {
        console.log("Ocorreu um erro ao conectar.", err);
    });


//Routes

app.get('/', (req, res) => { //Fazendo uma rota para o app.
    // res.send("Está funcionando com danemon. Agora não está mais. Mentira, está alterando conforme vou alterando o código."); //Servidor envia uma resposta dizendo que está funcionando.

    let search = req.query.job;
    let query = '%'+search+'%'; // -> se eu digitar uma parte da palavra ele vai buscar a vaga completa... não necessariamente preciso digitar todo título da vaga.

    if (!search) { //se não tiver busca, não acontecerá nada, apenas mostrará a home com jobs em data decrescente.
        Job.findAll({
            order: [
                ['createdAt', 'DESC'] //Vai encontrar todos os Jobs que tenho no banco de dados, com uma ordem DESCRESCENTE do dado createdAt.
        ]}) 
        .then(jobs => {
                res.render('index', {
                    jobs
                });
            })
        .catch(err => {
             console.log(err);
        });
    } else { //caso tenha alguma palavra na busca, vai buscar a palavra chave e mostrar jobs em ordem decrescente.
        Job.findAll({
            where: {title: {[Op.like]: query}}, //Junto com o query ali de cima, permite que a busca seja por palavras chave, busca parcial... invés de digitar todo título.
            //Ainda, precisamos do pacote Op do sequelize para utilizar esse tipo de busca complexa, por isso, requisitamos o sequelize e o Op lá no cabeçalho.
            order: [['createdAt', 'DESC']] //Vai encontrar todos os Jobs que tenho no banco de dados, com uma ordem DESCRESCENTE do dado createdAt.
        }) 
        .then(jobs => {
                res.render('index', {
                    jobs, search
                });
            })
        .catch(err => {
            console.log(err);
        });       
    }
});


// jobs routes > aqui estamos sinalizando que para fazer o CRUD nos jobs do site, precisamos acessar as rotas dentro da pasta /routes/jobs.
app.use('/jobs', require( './routes/jobs'));


//abrir um navegador e digitar localhost:3000 ou então no POSTMAN.
//Após, vamos no json no item script e trocamos o nome do arquivo para dev, e ele vai conter "nodemon app.js", desta forma, basta digitar npm run dev e o nodemon vai reinicializar a aplicação.
//Ou seja, podemos alterar a aplicação, rodar npm run dev no terminal e então ele vai atualizar, e depois basta atualizar o navegador para alteração ter efeito.

//Criar uma pasta (nesse caso a db) que contem as coisas do BANCO DE DADOS, tanto para conexão quanto ele em si. Nessa aplicação será utilizado o SQLite, é um BD leve, e que cria
//o próprio arquivo e vai atualizando. Serve para aplicações leves.
/*
Dentro da pasta db, vamos criar o arquivo connection.js, que é o arquivo que será responsável pela conexão com o banco de dados.

Depois, vamos baixar o Db Browser, que é um software que conseguimos ver de forma visual o nosso banco de dados e a estrutura dele. Podemos criar ou excluir campos, modificados dados, etc.
Para isso, basta abrirmos nosso arquivo .db com o SQLite Browser. Então, nesse software, nós criamos a nossa tabela de dados, com as informações e características de cada objeto (cada job).

Depois de ter criado a tabela, nós precisamos modificar, inserir dados, ler, retirar, etc. e para isso, existem duas maneiras de fazer: utilizar querys do SQL, ou de forma simplificada,
utilizar métodos de objetos através de um modelo. Esse modelo é o model, que é a "molde" da tabela, esse modelo contém as características dos objetos, como titulo, ID, salario, email, etc.
e nós vamos inserir os dados conforme esse molde.
Ou seja, nós vamos inserir dados no nosso banco através do Sequelize, só que ele precisa saber como as informações serão inseridas, quais campos serão preenchidos, e isso ocorre quando
informamos ao Sequelize, as informações padronizadas conforme o nosso "molde" ou modelo.
Nós criamos uma pasta chamada modelos (pois um código pode ter vários modelos), e dentro da pasta criamos o primeiro modelo que é o Job (por convenção, é o nome da nossa tabela -aquela criada
    no browser SQL-, mas no singular e primeira letra maiuscula).

Agora que o modelo está pronto, precisamos de rotas para criar, modificar, atualizar e deletar os dados. Até então temos só uma rota para o get, mas precisamos das 4 rotas somente para esse
modelo (ou essa tabela do nosso DB), se tivermos 10 tabelas/modelos, teremos 40 rotas, e isso ficará confuso. Portanto, precisamos criar uma pasta somente para rotas.

*/ 