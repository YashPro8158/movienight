import React, { useContext, useEffect, useState } from 'react'
import Navbar from '../../Reusable_Components/Navbar'
import { UserContext } from '../../context_Apis/userdetails'
export default function ProfilePage() {
    const value = useContext(UserContext);
    return (
        <>
            {/* <Navbar /> */}
            {value.userloggeddetails.userfullname}
        </>
    )
}
