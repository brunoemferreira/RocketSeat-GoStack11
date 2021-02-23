const express = require('express');
const { uuid, isUuid } = require("uuidv4");

const app = express();

// Tem que vir antes das rotas 
// fala para o express interpretar o json 
app.use(express.json());

/* 
 * Criando um Mock de dados para utilizar nos endpoints
 */
const projects = [];

function logRequests(request, response, next) {
  const { method, url } = request;
  const logLabel = `[${method.toUpperCase()}] ${url}`;

  console.time(logLabel);

  next(); // Chama o proximo middleware

  console.timeEnd(logLabel);
}

function validateProjectId(request, response, next) {
  const { id } = request.params;
  if (!isUuid(id)) {
    return response.status(400).json({ error: 'Invalid project ID' });
  }
  return next();
}

app.use(logRequests);

// Acessar o Recurso de Projects
app.get('/projects', (request, response) => {
  const { title } = request.query;

  const results = title
    ? projects.filter(project => project.title.includes(title))
    : projects;

  return response.json(results);
})

// Faz a Gravação do Registro 
app.post('/projects', (request, response) => {
  const { title, owner } = request.body;
  const project = { id: uuid(), title, owner }

  projects.push(project);

  return response.json(project);
})

app.put('/projects/:id', validateProjectId, (request, response) => {
  const { id } = request.params;
  const { title, owner } = request.body;
  // Busca o índice do projeto dentro do Array de projetos
  const projectIndex = projects.findIndex(project => project.id === id);

  // Verifica se o indice retornou resultado senão retorna erro  
  if (projectIndex < 0) {
    return response.status(400).json({ error: "Project not found" });
  }

  // Monta o objeto com as informações pegas acima  
  const project = {
    id,
    title,
    owner,
  }

  // Navega até a posição do index do array que foi filtrado acima 
  // para substituir o valor do projeto que esta naquele indice pelo projeto novo que foi gerado acima
  projects[projectIndex] = project;

  // aqui retorna o novo valor de projeto que foi gerado
  return response.json(project);
})

app.delete('/projects/:id', validateProjectId, (request, response) => {
  const { id } = request.params;

  const projectIndex = projects.findIndex(project => project.id === id);


  if (projectIndex < 0) {
    return response.status(400).json({ error: "Project not found" });
  }

  // Remove informação do indice, passa o index do array 
  // e quantas posições vai remover a partir do indice
  projects.splice(projectIndex, 1);

  // no Delete retorna em branco com send 
  return response.status(204).send();
})

// Porta que o servidor Escuta
app.listen(3333, () => {
  console.log('🚀 Back-End started !!!')
});

