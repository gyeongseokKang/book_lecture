import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { postsFacade } from "./posts-facade";
import type { Post } from "./posts-raw-api";

export const POSTS_QUERY_KEYS = {
  all: ["posts"] as const,
  lists: () => [...POSTS_QUERY_KEYS.all, "list"] as const,
  list: (filters: string) =>
    [...POSTS_QUERY_KEYS.lists(), { filters }] as const,
  details: () => [...POSTS_QUERY_KEYS.all, "detail"] as const,
  detail: (id: number) => [...POSTS_QUERY_KEYS.details(), id] as const,
};

// 게시글 목록 조회 훅
export const usePosts = () => {
  return useQuery({
    queryKey: POSTS_QUERY_KEYS.lists(),
    queryFn: () => postsFacade.getPosts(),
    staleTime: 5 * 60 * 1000, // 5분
    gcTime: 10 * 60 * 1000, // 10분
  });
};

// 단일 게시글 조회 훅
export const usePost = (id: number) => {
  return useQuery({
    queryKey: POSTS_QUERY_KEYS.detail(id),
    queryFn: () => postsFacade.getPost(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};

// 게시글 작성 훅
export const useCreatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (postData: Omit<Post, "id">) =>
      postsFacade.createPost(postData),
    onSuccess: () => {
      // 성공 시 게시글 목록 캐시 무효화
      queryClient.invalidateQueries({
        queryKey: POSTS_QUERY_KEYS.lists(),
      });
    },
    onError: (error) => {
      console.error("Post creation failed:", error);
    },
  });
};
