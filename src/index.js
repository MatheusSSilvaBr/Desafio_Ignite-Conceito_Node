const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

//MIDDLEWARE

function checksExistsUserAccount(request, response, next) {
  // Complete aqui
  const {username} = request.headers;

  const user = users.find((user) => user.username === username);

  if (!user){
    return response.status(404).json({error: "User not found"})
  }

  request.user = user;

  return next();

}

app.post('/users', (request, response) => {
  // Complete aqui
  const {name , username} = request.body;

  const userAlreadyExist = users.find((userAlreadyExist) => userAlreadyExist.username === username);
  
  if(userAlreadyExist){
    return response.status(400).json({error:"Should not be able to create a new user when username already exists"})
  }

  users.push({
    id: uuidv4(),
    name,
    username,
    todos: [],
  })

  const user = users.find((user) => user.username === username);

  return response.status(201).json(user).send();
  
});

app.get('/todos', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const {username} = request.headers;
  const {user} = request;

  return response.json(user.todos);
});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const {title, deadline} = request.body; 
  const {username} = request.headers;

  const {user} = request;
  
  const todo = {
    id: uuidv4(),
    title,
    done: false,
    deadline: new Date(deadline),
    created_at: new Date(),
  };

  user.todos.push(todo);
  
  return response.status(201).json(todo);
});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const {title, deadline} = request.body;
  const {username} = request.headers;
  const {id} = request.params;
  const {user} = request;

  const idTarefa = user.todos.find((idTarefa) => idTarefa.id === id);

  if(!idTarefa){
    return response.status(404).json({error: "Todo not exist"});
  }

  idTarefa.title = title;
  idTarefa.deadline = new Date(deadline);
  
  return response.json(idTarefa);

});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const {username} = request.headers;
  const {user} = request;
  const {id} = request.params;

  const idTodos = user.todos.find((idTodos) => idTodos.id === id);

  if(!idTodos){
    return response.status(404).json({error: "Todo not exist"});
  }

  idTodos.done = true;


  return response.json(idTodos);
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const {username} = request.headers;
  const {id} = request.params;
  const {user} = request;

  const idTodos = user.todos.find((idTodos) => idTodos.id === id);

  if(!idTodos){
    return response.status(404).json({error: "Todo not exist"});
  }

  const todos = user.todos;


  todos.splice(idTodos, 1);

  return response.status(204).send();
});

module.exports = app;