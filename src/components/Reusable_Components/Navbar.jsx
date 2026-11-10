import React, { useContext, useEffect, useState } from 'react'
import { UserContext } from '../context_Apis/userdetails'
import { Link, Outlet, useNavigate } from 'react-router-dom'
import './Navbar.css'
import { signOut } from "firebase/auth";
import { auth } from "../../firebase";

async function handleLogout() {
  try {

    await signOut(auth);

    alert("Logout Successful!");

    navigate("/signin");

  } catch (error) {

    console.log("Logout Error:", error);

  }
  navigate("/signin")
}
export default function Navbar() {
  const { userloggeddetails } = useContext(UserContext);


  const userName = userloggeddetails?.displayName || "User";

  const rawPhotoURL = userloggeddetails?.photoURL || "";

  const profilePhoto = rawPhotoURL.match(
    /^https?:\/\/[^\s)]+/
  )?.[0] || "";

  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    setImageError(false);
  }, [profilePhoto]);

  const showPhoto = profilePhoto && !imageError;
 


  const navigate = useNavigate();
  return (
    <div>
      <nav>
        <div className="topmenus">
          <div className="leftlogo" id="logo">
            <Link to="/">MovieNight</Link>
          </div>
          
          <div className="useraccount" id="useraccount">
            <div className="profileicon" id="profileicon">


              <div className="navbar_user">

                {showPhoto ? (
                  <img
                    src={profilePhoto}
                    alt="Profile"
                    className="user_profile_img"
                    onError={() => setImageError(true)}
                  />
                ) : (
                  <div className="user_initial">
                    {userName.charAt(0).toUpperCase()}
                  </div>
                )}

                <span className="user_name">
                  {userName}
                </span>

              </div>



              <i className="fi fi-rc-circle-user">
                <button onClick={handleLogout} className='signout_btn'
                >Signout</button></i>
            </div>
          </div>
        </div>
      </nav>
    </div>
  )
}
