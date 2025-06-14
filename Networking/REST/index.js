import express from 'express';
import bodyParser from 'body-parser';

const app = express();

app.use(bodyParser.json())
app.use(bodyParser.urlencoded())

const PORT = 5411

const todos = [
  {
    "id": 1,
    "title": "Todo 1",
    "isCompleted": false
  },
  {
    "id": 2,
    "title": "Todo 2",
    "isCompleted": false
  }
]

// READ
app.get('/todos', (req,res)=>{
  res.status(200).json(todos)
})

// CREATE
app.post('/todos', (req,res)=> {
  const newTodo = req.body
  todos.push(newTodo)
  res.status(201).send({
    message: "New todo created",
    data: todos
  })
})

// DELETE
app.delete('/todos/:id', (req,res)=> {
  const todoId = req.params.id
  console.log("todoId",todoId)
  const todoIndex = todos.findIndex((todo)=>todo.id == todoId)
  console.log("todoIndex", todoIndex)
  if (todoIndex!=-1){
    todos.slice(todoIndex, 1)
    return res.status(200).send({
    message: "Todo deleted successfully",
    data: todos
  })
  }

  return res.status(404).send('Todo not found')
  
})

app.all('/', (req, res)=>{
  res.send("Hi there!")
})

app.listen(PORT, ()=>{
  console.log("Server is running at PORT", PORT)
})