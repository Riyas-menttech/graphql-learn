import axios from "axios";
import { PubSub } from "graphql-subscriptions";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { Data } from "../Data.js";
import { AppDataSource } from "../orm/ormconfig.js";
import { User } from "../orm/entity/user-entity.js";
import { Product } from "../orm/entity/product-entity.js";
dotenv.config();

const pubsub = new PubSub();
const TODO_ADDED = "TODO_ADDED";
const TODO_UPDATED = "TODO_UPDATED";
const TODO_DELETED = "TODO_DELETED";
const EMAIL = process.env.EMAIL;
const PASSWORD = process.env.PASSWORD;
const JWT_SECRET = process.env.JWT_SECRET;

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
id:ID
userId:String!
title:String!
completed:Boolean,
user:User
}
type Orm {
 id: String
  firstName:String
  lastName:String
   age: String
}
type Product {
id:String
name:String
price:String
}
type Query {  
getTodos:[Todo],
getUsers:[User],
getSingleUser:[Orm],
getProducts:Product
}
type AuthPaylod { 
token:String
}
type Mutation {
addTodo(userId: String, title: String!, completed: Boolean):Todo
deleteTodo(id:ID!):Todo
updateTodo(id: ID!, userId: String, title: String, completed: Boolean): Todo
loginUser(email:String,password:String!):AuthPaylod
}
type Subscription {
todoAdded:Todo
todoUpdated:Todo
todoDeleted:Todo
}
`;

const getUserFromToken = (token: string) => {
  try {
    const newToken = token.slice(7);
    if (newToken) {
      console.log("inside", newToken);

      let user = jwt.verify(newToken, JWT_SECRET);
      return user;
    }
    return null;
  } catch (err) {
    console.log(err);
  }
};

export const resolvers = {
  Todo: {
    user: async (todo: any) =>
      (
        await axios.get(
          `https://jsonplaceholder.typicode.com/users/${todo.userId}`
        )
      ).data,
  },
  Query: {
    getTodos: async (parent, args, context) => {
      const user = getUserFromToken(context);
      console.log(user, "user-===<<ishere");
      if (user) {
        return (await axios.get("https://jsonplaceholder.typicode.com/todos"))
          .data;
      } else {
        return null;
      }
    },
    getProducts: async (parent, args, context) => {
      const user = getUserFromToken(context);
      
      if (user) {
        // let products = await AppDataSource.manager.find(Product);
        let productRepository = await AppDataSource.getRepository(Product)
        let products = await productRepository.findOneBy({id:1})
        return products;
      }
      return null;
    },
    getUsers: async (parent, args, context) => {
      const user = getUserFromToken(context);
      console.log(user, "usergettingevreywhgere");
      if (user) {
        return (await axios.get("https://jsonplaceholder.typicode.com/users"))
          .data;
      } else {
        return null;
      }
    },
    getSingleUser: async () => {
      let user = await AppDataSource.manager.find(User);

      return user;
      // return (
      //   await axios.get(`https://jsonplaceholder.typicode.com/users/${id}`)
      // ).data;
    },
  },
  Mutation: {
    addTodo: async (_, { title, completed }) => {
      const newTodo = { title, completed };
      const response = await axios.post(
        "https://jsonplaceholder.typicode.com/todos",
        newTodo
      );
      const addedTodo = response.data;
      pubsub.publish(TODO_ADDED, { todoAdded: addedTodo });
      return addedTodo;
    },
    updateTodo: async (_, { id, userId, title, completed }) => {
      const updatedFields = { userId, title, completed };
      const response = await axios.put(
        `https://jsonplaceholder.typicode.com/todos/${id}`,
        updatedFields
      );
      const updatedTodo = response.data;
      pubsub.publish(TODO_UPDATED, { todoUpdated: updatedTodo });
      return updatedTodo;
    },
    deleteTodo: async (_, { id }) => {
      const response = await axios.delete(
        `https://jsonplaceholder.typicode.com/todos/${id}`
      );
      const deletedTodo = { id };
      pubsub.publish(TODO_DELETED, { todoDeleted: deletedTodo });
      return deletedTodo;
    },
    loginUser: (_, { email, password }, headers) => {
      if (EMAIL == email && PASSWORD == password) {
        const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: "24h" });
        return { token };
      } else {
        throw new Error("Invalid credentials");
      }
    },
  },
  Subscription: {
    todoAdded: {
      subscribe: () => pubsub.asyncIterator([TODO_ADDED]),
    },
    todoUpdated: {
      subscribe: () => pubsub.asyncIterator([TODO_UPDATED]),
    },
    todoDeleted: {
      subscribe: () => pubsub.asyncIterator([TODO_DELETED]),
    },
  },
};
