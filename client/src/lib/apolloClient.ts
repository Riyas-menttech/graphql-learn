/* eslint-disable @typescript-eslint/no-explicit-any */
import { ApolloClient, InMemoryCache,HttpLink,split } from '@apollo/client';
import  {WebSocketLink} from '@apollo/client/link/ws';
import { getMainDefinition } from '@apollo/client/utilities';


// HTTP connection to the API
const httpLink = new HttpLink({
    uri:import.meta.env.VITE_GRAPHQL_HTTP || 'http://localhost:8000/graphql'
  });
//Websocket link for subscriptions
const wsLink : any = typeof window !== 'undefined'? new WebSocketLink({
    uri: import.meta.env.VITE_GRAPHQL_WS || 'ws://localhost:8000/graphql', // Your WebSocket server URL
    options: {
      reconnect: true,
    },
}):null;
// Using the split function to send data to each link
const splitLink =typeof window !== 'undefined'? split(
    ({ query }) => {
      const definition = getMainDefinition(query);
      return (
        definition.kind === 'OperationDefinition' &&
        definition.operation === 'subscription'
      );
    },
    wsLink,
    httpLink
  ) : httpLink;

const client = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache(),
});

export default client;