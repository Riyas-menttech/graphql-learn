'use client'
import { getSingleGame } from '@/graphQl/services';
import Link from 'next/link';
import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'

interface Game {
    id: String;
    title: String;
    platform: [];
  }

const SingleGame = () => {
    const {id} = useParams();
  const [gameData,setGameData] = useState<Game>()

    const getSingleGameDetails = async ()=>{
        try {
            const data = await getSingleGame(id[0])
            setGameData(data.game)
        } catch (error) {
            console.log(error);
            
        }
    }
    
    useEffect(()=>{
       getSingleGameDetails() 
    },[])
  return (
    <div>
      <div className="mt-10  flex justify-center items-center text-black bg-yellow-300 cursor-pointer" >
            
            <h3 >Title:{gameData?.title}</h3>
            <p>Platform: {gameData?.platform?.join(",")}</p>
          
        </div>
        <Link href='/add-game'><button className='bg-red-500 text-white p-5 mt-5'>Add Game</button></Link>
    </div>
  )
}

export default SingleGame
