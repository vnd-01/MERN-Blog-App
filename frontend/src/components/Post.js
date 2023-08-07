import React from "react";
import { formatISO9075 } from "date-fns";
import { Link } from "react-router-dom";

const Post = ({ _id, title, summary, image, content, createdAt, author }) => {
  return (
    <div>
      <div className="post">
        <div className="image">
          <Link to={`/post/${_id}`}>
            <img src={image} alt="" />
          </Link>
        </div>
        <div className="texts">
          <Link to={`/post/${_id}`}>
            <h2>{title}</h2>
          </Link>
          <p className="info">
            <a className="author">{author.username}</a>
            <time>{formatISO9075(new Date(createdAt))}</time>
          </p>
          <p className="summary">{summary}</p>
        </div>
      </div>
    </div>
  );
};

export default Post;
