import React, { useContext, useEffect} from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../UserContext";

const Header = () => {
  const { setUserInfo, userInfo } = useContext(UserContext);

  useEffect(() => {
    callProfile();
  }, []);

  const callProfile = async () => {
    try {
      const response = await fetch("https://mern-blog-app-vikas.vercel.app/profile", {
        credentials: "include",
      });

      if (response.ok) {
        const userInfo = await response.json();
        setUserInfo(userInfo);
      } else {
        console.error("Error fetching user profile");
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  const logout = () => {
    fetch("https://mern-blog-app-vikas.vercel.app/logout", {
      credentials: "include",
      method: "POST",
    });
    setUserInfo(null);
  };

  const username = userInfo?.username;

  return (
    <header>
      <Link to="/" className="logo">
        WordFlow
      </Link>
      <nav>
        {username && (
          <>
            <span>Welcome, {username}</span>
            <Link to="/create">Create New Post</Link>
            <a onClick={logout}>Logout</a>
          </>
        )}
        {!username && (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;
