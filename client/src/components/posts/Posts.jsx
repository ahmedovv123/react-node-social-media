import Post from "components/post/Post";
import "./posts.scss";
import { useQuery } from "@tanstack/react-query";
import { makeRequest } from "../../axios.js";

const Posts = ({ userId }) => {
  const { isLoading, error, data } = useQuery(["posts"], () =>
    makeRequest.get("/posts?userId=" + userId).then((res) => {
      return res.data;
    })
  );

  console.log(data)

  return (
    <div className="posts">
      {error
        ? "Something went wrong!"
        : isLoading
        ? "Loading..."
        : data.map((post) => <Post key={post.id} post={post} />)}
    </div>
  );
};

export default Posts;
