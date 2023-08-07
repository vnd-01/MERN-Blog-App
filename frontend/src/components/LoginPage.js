import React, { useContext, useState } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "../UserContext";

const LoginPage = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const {setUserInfo} = useContext(UserContext);

  const [redirect,setRedirect] = useState(false);

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const handleOnSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch("https://mern-blog-app-sand-eight.vercel.app/login", {
      method: "POST",
      body: JSON.stringify(formData),
      headers: {
        "Content-Type": "application/json",
      },
      credentials:'include',
    });
    if(response.ok){
        response.json().then(userInfo=>{
            setUserInfo(userInfo);
            setRedirect(true);
        });
    }
    else{
        alert("Wrong Credentials");
    }
    // if (response.status === 200) {
    //   alert("Login Successful");
    // } else {
    //   alert("Login Failed");
    // }
  };

  if(redirect){
    return <Navigate to={'/'}/>
  }

  return (
    <form className="login" onSubmit={handleOnSubmit}>
      <h1>Login</h1>
      <input
        name="username"
        type="text"
        placeholder="username"
        value={formData.username}
        onChange={handleOnChange}
      />
      <input
        name="password"
        type="password"
        placeholder="password"
        value={formData.password}
        onChange={handleOnChange}
      />
      <button>Login</button>
    </form>
  );
};

export default LoginPage;
