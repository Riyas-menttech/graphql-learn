'use client'
import React from 'react'
import { useMutation,gql } from "@apollo/client";

const ADD_GAME = gql`
mutation addGame($game: AddGameInput!) {
    addGame(game: $game) {
      id
      title
      platform
    }
  }
`

const DELETE_GAME = gql`
mutation deleteGame($id:ID!) {
    deleteGame(id:$id) {
        id,
        title
    }
}
`

const UPDATE_GAME = gql`
mutation updateGame($id:ID!,$edits:EditGameInput!) {
    updateGame(id:$id,edits:$edits){
        id,
        title,
        platform
    }
}`

const AddGame = () => {
    const [addGameMutation] = useMutation(ADD_GAME);
    const [deleteGameMutation] = useMutation(DELETE_GAME);
    const [updateGameMutation] = useMutation(UPDATE_GAME);
   
    const handleAdd = async()=>{
        try {
            const {data} = await addGameMutation({
                variables : {
                    game:{
                        title :'Nova trader',
                        platform:'linux'
                    }
                }
            })
            console.log('Game added:', data);
        } catch (error) {
            console.log(error);
        }
    }

    const handleDelete = async()=>{
        try {
             const {data} = await deleteGameMutation({
                variables : {
                    id:'883'
                }
             });
             console.log('Game Deleted:', data);
        } catch (error) {
            console.log(error);
            
        }
    }
    const handleUpadate = async()=>{
        try {
            const response = await updateGameMutation({
                variables:{
                    id:'1',
                    edits:{
                        title:'kerala',
                        platform:['Netflix']
                    }
                }
            });
            console.log(response,'updated Data');
            
        } catch (error) {
            console.log(error);
            
        }
    }
  return (
    <div className=''>
    <div className='flex flex-col border border-1px w-[50%] gap-5 '>
    {/* <input type="text" className=' bg-red-400' placeholder='title...'/>
     <input type="text" className=' bg-red-400' placeholder='platform'/> */}
    
    <button className='bg-green-500 p-5 mt-10' onClick={handleAdd}>Add Game</button>
    <button className='bg-red-500 p-5 mt-10' onClick={handleDelete}>Delete Game</button>
    <button className='bg-blue-500 p-5 mt-10' onClick={handleUpadate}>Update Game</button>
    </div>

    </div>
  )
}

export default AddGame
