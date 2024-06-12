// import axios from "axios";


// let URL = process.env.NEXT_PUBLIC_BASE_URL || "";

// export const getAllGames = async () => {
//   const query = `query {
//         games {
//             id,
//             title,
//             platform
//         }
//     }
//     `;
//   try {
//     const response = await axios.post(URL, { query });
//     if (response.data) {
//       return response.data;
//     }
//   } catch (error) {
//     console.log(error);
//   }
// };

// export const getSingleGame = async (id: String) => {
//   const query = `query {
//     game(id:${id}) {
//         id,
//         title,
//         platform
//     }
//   }`;
//   try {
//     const response = await axios.post(URL, { query });
//     return response.data.data;
//   } catch (error) {
//     console.log(error);
//   }
// };


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