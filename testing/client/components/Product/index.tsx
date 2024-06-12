/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import { useMutation, useQuery, useSubscription } from '@apollo/client';
import { ADD_TODO, FETCH_Products_ORM, FETCH_TODOS, FETCH_USERS, FETCH_USERS_ORM, TODO_ADDED } from '../../graphQl/services';
import { useState } from 'react';


function Product() {
  const {data ,loading,error} = useQuery(FETCH_Products_ORM);
//   const [addTodo] = useMutation(ADD_TODO);
  // const {data:Subscriptiondata} = useSubscription(TODO_ADDED);

//   const [title, setTitle] = useState('');
//   const [userId, setUserId] = useState('');

//   const handleAddTodo = async()=>{
//     await addTodo({
//       variables:{
//         title,completed:false
//       }
//     })
//   }

  if(error) return

  if(loading) return <h1>Loading...</h1>

  const todos =data.getProducts;

  return (
    <div>
      <h1>Users</h1>
      {/* <input
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
      <button onClick={handleAddTodo}>Add Todo</button> */}
      <ul>
        {todos?.map((todo:any) => (
          <li key={todo.id}>
            {todo.id} - {todo.name } + {todo.price}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Product
