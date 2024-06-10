import axios from "axios";

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
};
