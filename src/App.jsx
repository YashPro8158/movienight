
import { useEffect, useState } from 'react';

import { UserContext } from './components/context_Apis/userdetails';

import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from 'react-router-dom';

import Signup from './components/Signup_Components/signup';
import Signin from './components/Login_Components/signin';

import Home from './components/Main_display_Components/HomePage/Home';
import ProfilePage from './components/Main_display_Components/AboutPage/ProfilePage';

import { auth, db } from "./firebase";

import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import './App.css';


function App() {

  const [userloggeddetails, setuserloggeddetails] = useState(null);

  // Firebase loading state
  const [authLoading, setAuthLoading] = useState(true);


  // Observe Firebase authentication

  useEffect(() => {

    const unsubscribe = onAuthStateChanged(auth, async (user) => {

      try {

        if (user) {

          // Get user profile from Firestore
          console.log("Firebase User:", user);

          console.log("Google Photo URL:", user.photoURL);
          const userRef = doc(db, "users", user.uid);

          const userSnap = await getDoc(userRef);

          const profile = userSnap.exists()
            ? userSnap.data()
            : {};
          console.log("Firestore Photo URL:", profile.photoURL);
          // Get name from Firebase Auth or Firestore
          const firestoreName = [
            profile.firstName,
            profile.lastName
          ]
            .filter(Boolean)
            .join(" ");

          const finalName =
            user.displayName ||
            firestoreName ||
            "User";

          // Update React Context
          setuserloggeddetails({

            uid: user.uid,

            email: user.email,

            displayName: finalName,

            photoURL: user.photoURL || profile.photoURL || null

          });

          console.log("Logged User:", finalName);

        } else {

          setuserloggeddetails(null);

        }

      } catch (error) {

        console.log("User Profile Error:", error);

        setuserloggeddetails({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName || "User",
          photoURL: user.photoURL || null
        });

      } finally {

        setAuthLoading(false);

      }

    });

    return () => unsubscribe();

  }, []);



  // Wait until Firebase checks login status
  if (authLoading) {
    return <h2>Checking Authentication...</h2>;
  }


  return (

    <UserContext.Provider
      value={{
        userloggeddetails,
        setuserloggeddetails
      }}
    >

      <BrowserRouter>

        <Routes>

          {/* Root Route */}

          <Route
            path="/"
            element={
              userloggeddetails
                ? <Navigate to="/home" replace />
                : <Signin />
            }
          />


          {/* Home Route */}

          <Route
            path="/home"
            element={
              userloggeddetails
                ? <Home />
                : <Navigate to="/signin" replace />
            }
          />


          {/* Signup Route */}

          <Route
            path="/signup"
            element={<Signup />}
          />


          {/* Signin Route */}

          <Route
            path="/signin"
            element={
              userloggeddetails
                ? <Navigate to="/home" replace />
                : <Signin />
            }
          />


          {/* Profile Route */}

          <Route
            path="/profile"
            element={
              userloggeddetails
                ? <ProfilePage />
                : <Navigate to="/signin" replace />
            }
          />

        </Routes>

      </BrowserRouter>

    </UserContext.Provider>

  );

}

export default App;
