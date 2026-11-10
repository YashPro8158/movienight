
import React, { useState } from 'react';

import '../Reusable_Components/authentication.css';

import { Link, useNavigate } from 'react-router-dom';

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



export default function Signup({ loginpagestatus }) {

    // 1. Navigation
    const navigate = useNavigate();

    // // 2. Form state
    // const [signupformdata, setSignupformdata] = useState({
    //     firstname: "",
    //     lastname: "",
    //     emailid: "",
    //     password: "",
    //     confirmPassword: ""
    // });

    // 3. Other states
    const [ischecked, setIschecked] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // // 4. Handle all input changes
    // function handlesignupchange(e) {

    //     const { name, value } = e.target;

    //     setSignupformdata(prev => ({
    //         ...prev,
    //         [name]: value
    //     }));

    // }

    // // 5. Reset form
    // function handlesignupchangeReset() {

    //     setSignupformdata({
    //         firstname: "",
    //         lastname: "",
    //         emailid: "",
    //         password: "",
    //         confirmPassword: ""
    //     });

    //     setIschecked(false);
    // }

    // // 6. Firebase Signup
    // async function handleSignup(e) {

    //     e.preventDefault();

    //     if (isSubmitting) return;

    //     try {

    //         // Validation
    //         if (
    //             !signupformdata.firstname.trim() ||
    //             !signupformdata.lastname.trim() ||
    //             !signupformdata.emailid.trim() ||
    //             !signupformdata.password ||
    //             !signupformdata.confirmPassword
    //         ) {
    //             alert("Please fill all fields!");
    //             return;
    //         }

    //         if (
    //             signupformdata.password !==
    //             signupformdata.confirmPassword
    //         ) {
    //             alert("Passwords do not match!");
    //             return;
    //         }

    //         if (signupformdata.password.length < 8) {
    //             alert("Password must be at least 8 characters!");
    //             return;
    //         }

    //         if (!ischecked) {
    //             alert("Please accept Terms and Conditions!");
    //             return;
    //         }

    //         setIsSubmitting(true);

    //         // STEP 1: Create Firebase account
    //         const result = await createUserWithEmailAndPassword(
    //             auth,
    //             signupformdata.emailid.trim(),
    //             signupformdata.password
    //         );

    //         const user = result.user;

    //         // STEP 2: Update display name
    //         await updateProfile(user, {
    //             displayName: `${signupformdata.firstname} ${signupformdata.lastname}`
    //         });

    //         // STEP 3: Save user profile in Firestore
    //         await setDoc(doc(db, "users", user.uid), {

    //             uid: user.uid,

    //             firstName: signupformdata.firstname.trim(),

    //             lastName: signupformdata.lastname.trim(),

    //             email: user.email,

    //             createdAt: serverTimestamp()

    //         });

    //         alert("Signup Successful!");

    //         console.log("Firebase User:", user);

    //         // STEP 4: Reset form
    //         handlesignupchangeReset();

    //         // STEP 5: Navigate to Signin
    //         navigate('/signin');

    //     }

    //     catch (error) {

    //         console.log(
    //             "Signup Error:",
    //             error.code,
    //             error.message
    //         );

    //         if (error.code === "auth/email-already-in-use") {
    //             alert("This email is already registered!");
    //         }

    //         else if (error.code === "auth/invalid-email") {
    //             alert("Invalid email address!");
    //         }

    //         else if (error.code === "auth/weak-password") {
    //             alert("Password is too weak!");
    //         }

    //         else if (error.code === "permission-denied") {
    //             alert("Firestore permission denied. Check security rules.");
    //         }

    //         else {
    //             alert("Signup failed: " + error.message);
    //         }

    //     }

    //     finally {
    //         setIsSubmitting(false);
    //     }

    // }

    // 7. google signup 


    async function handleGoogleSignup() {

        try {

            // 1. Create Google provider
            const provider = new GoogleAuthProvider();

            // 2. Open Google account popup
            const result = await signInWithPopup(auth, provider);

            // 3. Get authenticated user
            const user = result.user;

            // 4. Get first and last name
            const nameParts = (user.displayName || "").split(" ");

            const firstName = nameParts[0] || "";
            const lastName = nameParts.slice(1).join(" ") || "";

            // 5. Save user profile in Firestore
            await setDoc(
                doc(db, "users", user.uid),
                {
                    uid: user.uid,
                    firstName: firstName,
                    lastName: lastName,
                    email: user.email,
                    photoURL: user.photoURL || "",
                    provider: "google",
                    createdAt: serverTimestamp()
                },
                { merge: true }
            );

            alert("Google Signup Successful!");

            console.log("Google User:", user);


            navigate("/");

        }

        catch (error) {

            console.log("Google Signup Error:", error.code, error.message);

            if (error.code === "auth/popup-closed-by-user") {
                alert("Google popup was closed!");
            }

            else if (error.code === "auth/popup-blocked") {
                alert("Please allow popups for this website!");
            }

            else if (
                error.code === "auth/account-exists-with-different-credential"
            ) {
                alert("This email is already registered using another login method. Please sign in with that method first.");
            }

            else {
                alert("Google Signup Failed: " + error.message);
            }

        }

    }


    // 8. UI
    return (

        <>

            <div className="authentication_container">

                <div className="signupform">

                    <div className="formheading">

                        <h1>Signup</h1>
                        <p>Signup with these accounts </p>



                    </div>



                    {/* Google Signup - implement in next stage */}

                    <button
                        type="button"
                        onClick={handleGoogleSignup}
                    >
                        <img
                            width="24"
                            height="24"
                            src="https://img.icons8.com/color/48/google-logo.png"
                            alt="Google"
                        />

                        Signup with Google
                    </button>
                    <p>
                        Already have an account ?{" "}
                        <Link to="/signin">Signin</Link>
                    </p>


                </div>

            </div>

        </>

    );

}
