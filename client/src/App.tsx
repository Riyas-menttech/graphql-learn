/* eslint-disable @typescript-eslint/no-explicit-any */
import './App.css'
import { useMutation, useQuery } from '@apollo/client';
import { ADD_TODO, FETCH_TODOS } from './lib/graphql';
import { useState } from 'react';


function App() {
  const {data ,loading,error} = useQuery(FETCH_TODOS);
  const [addTodo] = useMutation(ADD_TODO);

  const [title, setTitle] = useState('');
  const [userId, setUserId] = useState('');

  const handleAddTodo = async()=>{
    await addTodo({
      variables:{
        title,completed:false
      }
    })
  }

  if(error) return

  if(loading) return <h1>Loading...</h1>

  const todos =data.getTodos;

  return (
    <div>
      <h1>Todos</h1>
      <input
        type="text"
        placeholder="User ID"
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
      />
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <button onClick={handleAddTodo}>Add Todo</button>
      <ul>
        {todos?.map((todo:any) => (
          <li key={todo.id}>
            {todo.title} - {todo.completed ? 'Completed' : 'Not completed'} (User: {todo.user.name})
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App
