/* eslint-disable @typescript-eslint/no-explicit-any */
import { ApolloClient, InMemoryCache,HttpLink } from '@apollo/client';
// import  {WebSocketLink} from '@apollo/client/link/ws';
// import { getMainDefinition } from '@apollo/client/utilities';
import { setContext } from '@apollo/client/link/context';


// HTTP connection to the API
const httpLink = new HttpLink({
    uri:import.meta.env.VITE_GRAPHQL_HTTP || 'http://localhost:8000/graphql'
  });
//Websocket link for subscriptions
// const wsLink : any = typeof window !== 'undefined'? new WebSocketLink({
//     uri: import.meta.env.VITE_GRAPHQL_WS || 'ws://localhost:8000/graphql', // Your WebSocket server URL
//     options: {
//       reconnect: true,
//     },
// }):null;
// // Using the split function to send data to each link
// const splitLink =typeof window !== 'undefined'? split(
//     ({ query }) => {
//       const definition = getMainDefinition(query);
//       return (
//         definition.kind === 'OperationDefinition' &&
//         definition.operation === 'subscription'
//       );
//     },
//     wsLink,
//     httpLink
//   ) : httpLink;


  const authLink = setContext((_, { headers }) => {
    // Get the authentication token from local storage if it exists
    const sampleToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InJpeWF6QG1lbnQudGVjaCIsImlhdCI6MTcxODEwNjcyOSwiZXhwIjoxNzE4MTkzMTI5fQ.Xcji8s1lfWdFfKNYLkQgnDySolV8ucPCoxlJe14ungE'
    localStorage.setItem('token',sampleToken)
    const newToken = localStorage.getItem('token');
    return {
      headers: {
        ...headers,
        authorization: newToken ? `Bearer ${newToken}` : '',
      },
    };
  });

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

export default client;