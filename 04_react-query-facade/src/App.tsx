import "./App.css";
import { usePosts } from "./api/posts-hooks";

function App() {
  const { data } = usePosts();

  return (
    <div>
      {data?.map((post, index) => (
        <div key={post.id}>
          {" "}
          {index + 1} {post.title} {post.id} {post.author || "unknown"}
        </div>
      ))}
    </div>
  );
}

export default App;
