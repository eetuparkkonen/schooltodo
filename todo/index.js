const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const app = express();
const port = 3000;

// cors - allow connection from different domains and ports
app.use(cors());

// convert json string to json object (from request)
app.use(express.json());

// mongo here...

const mongoDB = 'mongodb+srv://eetuparkkonen:0659@fullstack-demo.nprou.mongodb.net/todo?retryWrites=true&w=majority';
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  console.log('Database test connected');
});

// scheema
const todoSchema = new mongoose.Schema({
  text: { type: String, required: true },
});

// model
const Todo = mongoose.model('Todo', todoSchema, 'todos');

// todos-route
app.get('/todos', async (request, response) => {
  const todos = await Todo.find({});
  response.json(todos);
});

app.get('/todos/:id', async (request, response) => {
  const todo = await Todo.findById(request.params.id);
  if (todo) response.json(todo);
  else response.status(404).end();
});

app.delete('/todos/:id', async (request, response) => {
  const deletedTodo = await Todo.findByIdAndRemove(request.params.id);
  if (deletedTodo) response.json(deletedTodo);
  else response.status(404).end();
});

app.post('/todos', async (request, response) => {
  const { text } = request.body;
  const todo = new Todo({
    text: text,
  });
  const savedTodo = await todo.save();
  response.json(savedTodo);
});

app.put('/todos/:id', async (req, res) => {
  const { id: _id } = req.params;
  const { text } = req.body;
  console.log(req.body);

  const newTodo = {
    _id,
    text,
  };

  console.log(newTodo);

  Todo.findByIdAndUpdate(_id, newTodo, (err) => {
    if (err) {
      console.log(err);
    } else {
      res.json(newTodo);
    }
  });
});

// app listen port 3000
app.listen(port, () => {
  console.log('Example app listening on port 3000');
});
