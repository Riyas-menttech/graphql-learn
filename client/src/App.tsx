import './App.css'
import { useQuery, gql } from '@apollo/client';

const FETCH_TODOS = gql`
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

function App() {
  const {data ,loading,error} = useQuery(FETCH_TODOS);

  if(error) return

  if(loading) return <h1>Loading...</h1>

  return (
    <>
     {data && data.getTodos?.map((item:any)=>(
      <div>
        <h1>{item.title}</h1>
        <h1>{item.completed}</h1>
        <h1>{item.user.id}</h1>
        <h1>{item.user.name}</h1>
      </div>
     ))}
    </>
  )
}

export default App
