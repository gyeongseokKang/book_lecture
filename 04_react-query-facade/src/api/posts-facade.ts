import { postsRawApi, type Post } from "./posts-raw-api";

// 비즈니스 로직과 에러 처리가 포함된 Facade
export const postsFacade = {
  getPost: async (id: number): Promise<Post> => {
    try {
      const post = await postsRawApi.getPost(id);

      // 비즈니스 로직: 제목 정규화
      return {
        ...post,
        title: post.title.charAt(0).toUpperCase() + post.title.slice(1),
      };
    } catch (error) {
      console.error("Failed to fetch post:", error);
      throw new Error("게시글을 불러오는 중 오류가 발생했습니다.");
    }
  },

  getPosts: async (): Promise<Post[]> => {
    try {
      const posts = await postsRawApi.getPosts();

      // 비즈니스 로직: 최신 5개만 반환
      return posts.slice(0, 5).map((post) => ({
        ...post,
        title: post.title.charAt(0).toUpperCase() + post.title.slice(1),
      }));
    } catch (error) {
      console.error("Failed to fetch posts:", error);
      throw new Error("게시글 목록을 불러오는 중 오류가 발생했습니다.");
    }
  },

  createPost: async (postData: Omit<Post, "id">): Promise<Post> => {
    try {
      // 유효성 검사
      if (!postData.title.trim() || !postData.body.trim()) {
        throw new Error("제목과 내용을 모두 입력해주세요.");
      }

      const newPost = await postsRawApi.createPost(postData);
      return newPost;
    } catch (error) {
      console.error("Failed to create post:", error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("게시글 작성 중 오류가 발생했습니다.");
    }
  },
};
