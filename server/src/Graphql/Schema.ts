import axios from "axios";
import {PubSub} from 'graphql-subscriptions'

const pubsub = new PubSub();
const TODO_ADDED = 'TODO_ADDED';
const TODO_UPDATED = 'TODO_UPDATED';
const TODO_DELETED = 'TODO_DELETED';

export const typeDefs = `
type Geo {
        lat:String,
        lng: String
}
type Address {
      street: String,
      suite: String,
      city: String,
      zipcode: String,
      geo:Geo
}
type User {
    id:ID!
    name: String!,
    username:String!,
    email: String!,
    address: Address
     
}
type Todo {
id:ID!
userId:String!
title:String!
completed:Boolean,
user:User
}
type Query {  
getTodos:[Todo],
getUsers:[User],
getSingleUser(id:ID!):User
}
type Mutation {
addTodo(userId: String!, title: String!, completed: Boolean):Todo
deleteTodo(id:ID!):Todo
updateTodo(id: ID!, userId: String, title: String, completed: Boolean): Todo
}
type Subscription {
todoAdded:Todo
todoUpdated:Todo
todoDeleted:Todo
}
`;

export const resolvers = {
    Todo : {
      user : async (todo:any)=> (await axios.get(`https://jsonplaceholder.typicode.com/users/${todo.userId}`)
    ).data
    },
  Query: {
    getTodos: async () => {
      return (await axios.get("https://jsonplaceholder.typicode.com/todos"))
        .data;
    },
    getUsers: async () => {
      return (await axios.get("https://jsonplaceholder.typicode.com/users"))
        .data;
    },
    getSingleUser: async (_, { id }) => {
      return (
        await axios.get(`https://jsonplaceholder.typicode.com/users/${id}`)
      ).data;
    },
  },
  Mutation :{
    addTodo: async (_, { userId, title, completed }) => {
        const newTodo = { userId, title, completed };
        const response = await axios.post('https://jsonplaceholder.typicode.com/todos', newTodo);
        const addedTodo = response.data;
        pubsub.publish(TODO_ADDED,{todoAdded:addedTodo})
        return addedTodo;
  },
  updateTodo: async (_, { id, userId, title, completed }) => {
    const updatedFields = { userId, title, completed };
    const response = await axios.put(`https://jsonplaceholder.typicode.com/todos/${id}`, updatedFields);
    const updatedTodo = response.data;
    pubsub.publish(TODO_UPDATED,{todoUpdated:updatedTodo});
    return updatedTodo;
  },
  deleteTodo: async (_, { id }) => {
    const response = await axios.delete(`https://jsonplaceholder.typicode.com/todos/${id}`);
    const deletedTodo = { id };
    pubsub.publish(TODO_DELETED, { todoDeleted: deletedTodo });
    return deletedTodo;
}

},
Subscription : {
    todoAdded:{
        subscribe:()=>pubsub.asyncIterator([TODO_ADDED])
    },
    todoUpdated:{
        subscribe:()=>pubsub.asyncIterator([TODO_UPDATED])
    },
    todoDeleted:{
        subscribe:()=>pubsub.asyncIterator([TODO_DELETED])
    }
}
}
