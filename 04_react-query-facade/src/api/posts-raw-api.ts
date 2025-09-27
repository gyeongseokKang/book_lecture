// 순수한 HTTP 요청 로직
export interface Post {
  id: number;
  title: string;
  body: string;
  userId: number;
  author: string;
}

export const postsRawApi = {
  getPost: async (id: number): Promise<Post> => {
    const response = await fetch(
      `https://jsonplaceholder.typicode.com/posts/${id}`
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  },

  getPosts: async (): Promise<Post[]> => {
    const response = await fetch("https://jsonplaceholder.typicode.com/posts");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  },

  createPost: async (post: Omit<Post, "id">): Promise<Post> => {
    const response = await fetch("https://jsonplaceholder.typicode.com/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(post),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  },
};
