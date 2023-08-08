const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connection = require("./connection/db");
const UserModel = require("./models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const PostModel = require("./models/Post");

const app = express();
connection();
const salt = bcrypt.genSaltSync(10);
app.use(
  cors({
    credentials: true,
    origin: ["https://mern-blog-app-frontend-vikas.vercel.app"],
    methods: ["POST", "GET", "PUT", "DELETE"],
  })
);
app.use(express.json());
app.use(cookieParser());
dotenv.config();

app.get("/", (req, res) => {
  res.json("Hi, Welcome");
});

app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  try {
    const newUser = await UserModel.create({
      username,
      password: bcrypt.hashSync(password, salt),
    });
    res.json(newUser);
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const findUser = await UserModel.findOne({ username });
    const pass = bcrypt.compareSync(password, findUser.password);
    if (pass) {
      //logged in
      try {
        const token = jwt.sign(
          { username, id: findUser._id },
          process.env.SECRET_KEY
        );
        res.cookie("token", token).json({
          id: findUser._id,
          username,
        });
      } catch (error) {
        throw error;
      }
    } else {
      res.status(400).json("Wrong Credentials");
    }
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }
});

app.get("/profile", (req, res) => {
  const { token } = req.cookies;
  jwt.verify(token, process.env.SECRET_KEY, {}, (err, info) => {
    if (err) throw err;
    res.json(info);
  });
});

app.post("/logout", (req, res) => {
  res.cookie("token", "").json("ok");
});

// app.post("/post", uploadMiddleWare.single("file"), async (req, res) => {
//   //console.log(req.file);
//   const { originalname, path } = req.file;
//   const splits = originalname.split(".");
//   //console.log(splits);
//   const newPath = path + "." + splits[1];
//   fs.renameSync(path, newPath);
//   const { token } = req.cookies;
//   jwt.verify(token, process.env.SECRET_KEY, {}, async (err, info) => {
//     if (err) throw err;
//     const { title, summary, content,imageUrl } = req.body;
//     const newPost = await PostModel.create({
//       title,
//       summary,
//       content,
//       image: imageUrl,
//       author: info.id,
//     });
//     res.json(newPost);
//   });
// });

app.post("/post", async (req, res) => {
  const { token } = req.cookies;
  jwt.verify(token, process.env.SECRET_KEY, {}, async (err, info) => {
    if (err) throw err;
    const { title, summary, content, imageUrl } = req.body;
    //console.log(req.body);
    const newPost = await PostModel.create({
      title,
      summary,
      content,
      image: imageUrl,
      author: info.id,
    });
    res.json(newPost);
  });
});

app.get("/post", async (req, res) => {
  const posts = await PostModel.find()
    .populate("author", ["username"])
    .sort({ createdAt: -1 })
    .limit(20);
  res.json(posts);
});

app.get("/post/:id", async (req, res) => {
  const { id } = req.params;
  const foundPost = await PostModel.findById(id).populate("author", [
    "username",
  ]);
  res.json(foundPost);
});

app.put("/post", async (req, res) => {
  const { imageUrl } = req.body;
  console.log(req.body);
  const { token } = req.cookies;
  jwt.verify(token, process.env.SECRET_KEY, {}, async (err, info) => {
    if (err) throw err;
    const { id, title, summary, content } = req.body;
    const findPost = await PostModel.findById(id);
    const isAuthor =
      JSON.stringify(findPost.author) === JSON.stringify(info.id);
    if (!isAuthor) {
      return res.status(400).json("You are not Author");
    }
    await findPost.updateOne({
      title,
      summary,
      content,
      image: imageUrl ? imageUrl : findPost.image,
    });
    res.json(findPost);
  });
});

app.delete("/delete/:id", async (req, res) => {
  const { token } = req.cookies;
  jwt.verify(token, process.env.SECRET_KEY, {}, async (err, info) => {
    if (err) throw err;
    const { id } = req.params;
    const deletePost = await PostModel.findById(id);
    const isAuthor =
      JSON.stringify(deletePost.author) === JSON.stringify(info.id);
    if (!isAuthor) {
      return res.status(400).json("You are not Author");
    }
    await PostModel.deleteOne({ _id: id });
    res.json("deleted Successfully");
  });
});

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Server Started on ${port}`);
});
