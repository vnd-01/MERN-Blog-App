import React from "react";
import "./App.css";
import { Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import HomePage from "./components/HomePage";
import LoginPage from "./components/LoginPage";
import RegisterPage from "./components/RegisterPage";
import { UserContextProvider } from "./UserContext";
import CreatePost from "./components/CreatePost";
import PostPage from "./components/PostPage";
import EditPost from "./components/EditPost";

function App() {
  return (
    <UserContextProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/create" element={<CreatePost />} />
          <Route path="/post/:id" element={<PostPage />} />
          <Route path="/edit/:id" element={<EditPost />} />
        </Route>
      </Routes>
    </UserContextProvider>
  );
}

export default App;
