import React from 'react'
import { UserContext } from '../../context_Apis/userdetails'
import Navbar from '../../Reusable_Components/Navbar'
import Moviewshow from '../Movieshow/moviewshow'
import './Home.css'

export default function Home() {



    return (
        <>
            <Navbar/>
            
            <Moviewshow />

        </>
    );
}
