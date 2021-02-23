const express = require("express");
const cors = require("cors");

const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

// Array para mock do Repositório
const repositories = [];

// Rota que lista todos os repositórios
app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

// Rota que grava um repositório
app.post("/repositories", (request, response) => {
  // Pega as informaçoes do corpo da requisição  ( title, url, techs )
  const { title, url, techs } = request.body;
  // Carrega um array de repositório com as informações
  const repository = { id: uuid(), title, url, likes: 0, techs: techs };
  // Grava no array de repositorios o repositório enviado
  repositories.push(repository);
  // Retorna o json do repositório  
  return response.json(repository);
});

// Rota que atualiza algum repositório que foi informado
app.put("/repositories/:id", (request, response) => {
  // pega o id dos parametros da requisição 
  const { id } = request.params;
  // pega os dados de titlem, url, techs do corpo da requisição 
  const { title, url, techs } = request.body;
  // lega os likes do corpo da requisição 
  const { likes } = request.body;
  // se houver likes for false ele retorna zero para likes
  if (likes) {
    return response.json({ likes: 0 });
  }

  // faz a busca no array pelo index correspondente ao id informado 
  const repositoryIndex = repositories.findIndex(repository => repository.id === id);
  // cria um objeto repository e armazena ods dados recebidos na requisiçao 
  const repository = { url, title, techs: techs };
  // valida se na busca pelo index no array foi encontrado algum repositorio
  if (repositoryIndex < 0) {
    // caso não haja repositorio retornado devolve status 400 e uma mensagem de erro
    return response.status(400).json({ error: 'Repository not found ' });
  }
  // atualiza os dados no array repositories no index informado com os novos dados recebidos na requisição  
  repositories[repositoryIndex] = repository;
  // retorna um jscon com as novas informações atualizadas
  return response.json({ id, url, title, techs });
});

// Rota que faz exclusão de reposiotrio informado
app.delete("/repositories/:id", (request, response) => {
  // carrega o id do paramentro da requisição 
  const { id } = request.params;
  // busca no array de repositories o indice qeu bata com o id informado 
  const repositoryIndex = repositories.findIndex(repository => repository.id === id);
  // se não encontrar o indice retorna erro status 400 e uma mensagem de erro
  if (repositoryIndex < 0) {
    return response.status(400).json({ error: 'Repository not found ' });
  }
  // exclui o registro que foi informado naquela posição do index
  repositories.splice(repositoryIndex, 1);
  // retorna status 204 
  return response.status(204).send();
});

// Rota de gravação dos likes 
app.post("/repositories/:id/like", (request, response) => {
  // carrega o id do paramentro da requisição 
  const { id } = request.params;
  // busca no array de repositories o indice qeu bata com o id informado 
  const repositoryIndex = repositories.findIndex(repository => repository.id === id);
  // se não encontrar o indice retorna erro status 400 e uma mensagem de erro
  if (repositoryIndex < 0) {
    return response.status(400).json({ error: 'Repository not found ' });
  }
  // pega o registro naquela posição dentor do array e atualiza o valor dele +1
  repositories[repositoryIndex].likes += 1;
  // grava o repositório selecionado na variavel repository
  const repository = repositories[repositoryIndex];
  // retorna o valor atualizado de likes do repositorio selecionado 
  return response.json({ likes: repository.likes });
});

module.exports = app;