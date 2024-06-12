import {  gql } from '@apollo/client';


export const FETCH_TODOS = gql`
  query TodoFetch {
    getTodos {
      id
      title
      completed
      user {
      id
      name
      }
    }
  }`


export const ADD_TODO = gql`
   mutation AddTodo($userId:String,$title:String){
   addTodo(userId:$userId,title:$title,completed:false){
      
      title
      completed
   }
   }
`
export const TODO_ADDED = gql`
  subscription TodoAdded {
     todoAdded {
       id,title,
       completed
      user {
        name
      }
     }
  }
`