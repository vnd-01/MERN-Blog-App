import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Navigate } from "react-router-dom";

const modules = {
  toolbar: [
    [{ header: [1, 2, false] }],
    ["bold", "italic", "underline", "strike", "blockquote"],
    [
      { list: "ordered" },
      { list: "bullet" },
      { indent: "-1" },
      { indent: "+1" },
    ],
    ["link", "image"],
    ["clean"],
  ],
};

const formats = [
  "header",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "list",
  "bullet",
  "indent",
  "link",
  "image",
];

const CreatePost = () => {
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [files, setFiles] = useState("");
  const [redirect, setRedirect] = useState(false);

  const handleOnSubmit = async (e) => {
    e.preventDefault();

    // Upload the image to Cloudinary
    const picData = new FormData();
    picData.append("file", files[0]);
    picData.append("upload_preset", "blog-app");
    picData.append("cloud_name", "vnd01");

    try {
      const picResponse = await fetch(process.env.REACT_APP_UPLOAD_URL, {
        method: "POST",
        body: picData,
      });
      if (picResponse.ok) {
        const pic = await picResponse.json();
        const imageUrl = pic.url;

        // Create the main POST request data
        const postData = {
          title: title,
          summary: summary,
          content: content,
          imageUrl: imageUrl,
        };

        // Now, create and send the main POST request with all the data
        const response = await fetch("http://localhost:4000/post", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(postData),
          credentials: "include",
        });

        if (response.ok) {
          setRedirect(true);
        }
      } else {
        console.error("Cloudinary upload failed.");
      }
    } catch (error) {
      console.error("Error uploading image to Cloudinary:", error);
    }
  };

  if (redirect) {
    return <Navigate to="/" />;
  }

  return (
    <form onSubmit={handleOnSubmit}>
      <input
        value={title}
        type="text"
        placeholder="Title"
        onChange={(e) => setTitle(e.target.value)}
      />
      <input
        value={summary}
        type="summary"
        placeholder="Summary"
        onChange={(e) => setSummary(e.target.value)}
      />
      <input type="file" onChange={(e) => setFiles(e.target.files)} />
      <ReactQuill
        value={content}
        modules={modules}
        formats={formats}
        onChange={(newValue) => setContent(newValue)}
      />
      <button style={{ marginTop: "5px" }}>Post</button>
    </form>
  );
};

export default CreatePost;
