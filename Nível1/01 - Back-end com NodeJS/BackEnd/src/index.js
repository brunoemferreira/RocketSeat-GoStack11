const express = require('express');

const app = express();

// Tem que vir antes das rotas 
// fala para o express interpretar o json 
app.use(express.json());

/* 
 * Criando um Mock de dados para utilizar nos endpoints
 */
const projects = [];





// Acessar o Recurso de Projects
app.get('/projects', (request, response) => {
  //const { title, owner } = request.query;

  //console.log(title);
  //console.log(owner);

  return response.json(projects);
})

app.post('/projects', (request, response) => {
  const { title, owner } = request.body;

  console.log(title);
  console.log(owner);

  return response.json(['Projeto 1',
    'Projeto 2',
    'Projeto 3']);
})

app.put('/projects/:id', (request, response) => {
  const params = request.params;

  console.log(params);

  return response.json(['Projeto 4',
    'Projeto 2',
    'Projeto 3']);
})

app.delete('/projects/:id', (request, response) => {
  return response.json([
    'Projeto 2',
    'Projeto 3']);
})

// Porta que o servidor Escuta
app.listen(3333, () => {
  console.log('🚀 Back-End started !!!')
});

