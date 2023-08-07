import React, { useEffect, useState } from "react";
import Post from "./Post";

const HomePage = () => {
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    fetch("https://mern-blog-app-vikas.vercel.app/post").then((response) => {
      response.json().then((posts) => {
        setPosts(posts);
      });
    });
  }, []);

  return (
    <>
      {posts.length>0 &&
        posts.map((post) => {
          return <Post key={post._id} {...post}/>
        })}
    </>
  );
};

export default HomePage;
