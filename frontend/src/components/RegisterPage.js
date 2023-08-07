import React, { useState } from "react";
import { Navigate } from "react-router-dom";

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [redirect, setRedirect] = useState(false);
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
    const response = await fetch(
      "https://mern-blog-app-vikas.vercel.app/register",
      {
        method: "POST",
        body: JSON.stringify(formData),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (response.status === 200) {
      setRedirect(true);
      alert("Registration Successful");
    } else {
      alert("Registration Failed");
    }
  };

  if (redirect) {
    return <Navigate to="/login" />;
  }

  return (
    <form className="register" onSubmit={handleOnSubmit}>
      <h1>Register</h1>
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
      <button>Register</button>
    </form>
  );
};

export default RegisterPage;
