import client from '@/lib/apolloClient'
import { ApolloProvider } from '@apollo/client'
import React from 'react'

const App = ({children}:any) => {
  return (
         <ApolloProvider client={client}>{children} </ApolloProvider>
  )
}

export default App
