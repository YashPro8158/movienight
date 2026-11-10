import { useState, useContext } from 'react'
import '../Reusable_Components/authentication.css'
import { UserContext } from '../context_Apis/userdetails'
import { Link, useNavigate } from 'react-router-dom'


import {
    createUserWithEmailAndPassword,
    updateProfile,
    GoogleAuthProvider,
    signInWithPopup
} from 'firebase/auth';

import {
    doc,
    setDoc,
    serverTimestamp
} from 'firebase/firestore';

import { auth, db } from '../../firebase';

async function handleGoogleSignin() {
    try {

        const provider = new GoogleAuthProvider();

        // Google authentication
        const result = await signInWithPopup(auth, provider);

        const user = result.user;

        // Check existing Firestore profile
        const userRef = doc(db, "users", user.uid);

        const userSnap = await getDoc(userRef);

        // Create profile only if it doesn't exist
        if (!userSnap.exists()) {

            const nameParts = (user.displayName || "").split(" ");

            await setDoc(userRef, {
                uid: user.uid,
                firstName: nameParts[0] || "",
                lastName: nameParts.slice(1).join(" ") || "",
                email: user.email,
                photoURL: user.photoURL || "",
                provider: "google",
                createdAt: serverTimestamp()
            });

        }

        alert("Google Signin Successful!");

        navigate("/home");

    } catch (error) {

        console.log("Google Signin Error:", error);

        alert("Google Signin Failed: " + error.message);

    }
}

export default function Signin() {
    const [signinformdata, setSigninformdata] = useState({
        loginemailid: "",
        loginpassword: ""
    })
    function handlesigninform(e) {
        setSigninformdata({
            ...signinformdata, [e.target.name]: e.target.value
        })
        console.log(signinformdata);
    }

    function handlesigninformReset() {

        setSigninformdata({
            loginemailid: "",
            loginpassword: ""
        });
    }


    const [loginsuccess, setloginsuccess] = useState(false)
    const saved = localStorage.getItem("AllregisterUsers");
    const [error, seterror] = useState(false);
    const data = JSON.parse(saved);
    let searchdatafilter;
    const value = useContext(UserContext)
    const navigate = useNavigate();

    return (
        <>
            <div className="authentication_container">
                <div className="signupform">
                    <div className="formheading">
                        <h1>Signin</h1>
                        <p>Signin with these accounts </p>
                        <p>{loginsuccess === true ? "Sigin Success" : error === true ? "No user found !" : null}</p>
                    </div>
                    <div className="forminput">

                        
                        <button
                            type="button"
                            onClick={handleGoogleSignin}
                        ><img width="48" height="48" src="https://img.icons8.com/color/48/google-logo.png" alt="google-logo" />Signin with Google</button>

                        <p>Not have an account ? <Link to="/signup" >Signup</Link></p>

                    </div>
                </div>
            </div >

        </>
    )
}
