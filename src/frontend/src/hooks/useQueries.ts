import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Article } from "../backend";
import { useActor } from "./useActor";

export function useGetAllArticles() {
  const { actor, isFetching } = useActor();
  return useQuery<Article[]>({
    queryKey: ["articles"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllArticles();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetFeaturedArticles() {
  const { actor, isFetching } = useActor();
  return useQuery<Article[]>({
    queryKey: ["featured-articles"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getFeaturedArticles();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateArticle() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (params: {
      title: string;
      summary: string;
      category: string;
      imageUrl: string;
      author: string;
      isFeatured: boolean;
    }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.createArticle(
        params.title,
        params.summary,
        params.category,
        params.imageUrl,
        params.author,
        params.isFeatured,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["articles"] });
      queryClient.invalidateQueries({ queryKey: ["featured-articles"] });
    },
  });
}
