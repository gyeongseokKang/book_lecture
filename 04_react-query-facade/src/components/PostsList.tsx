import { usePosts } from "../api/posts-hooks";

export const PostsList = () => {
  const { data: posts, isLoading, error } = usePosts();

  if (isLoading) return <div>로딩 중...</div>;
  if (error) return <div>오류: {error.message}</div>;

  return (
    <div>
      <h2>게시글 목록</h2>
      {posts?.map((post) => (
        <div
          key={post.id}
          style={{ border: "1px solid #ccc", margin: "10px", padding: "10px" }}
        >
          <h3>{post.title}</h3>
          <p>{post.body}</p>
          <small>작성자 ID: {post.userId}</small>
        </div>
      ))}
    </div>
  );
};
