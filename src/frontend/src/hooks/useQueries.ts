import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Article } from "../backend";
import { useActor } from "./useActor";

export interface ExternalNews {
  id: bigint;
  title: string;
  summary: string;
  sourceUrl: string;
  sourceName: string;
  category: string;
  fetchedAt: bigint;
}

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

export function useGetExternalNews() {
  const { actor, isFetching } = useActor();
  return useQuery<ExternalNews[]>({
    queryKey: ["external-news"],
    queryFn: async () => {
      if (!actor) return [];
      return (actor as any).getExternalNews();
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 6 * 60 * 60 * 1000,
  });
}

export function useGetLastFetchedTime() {
  const { actor, isFetching } = useActor();
  return useQuery<[] | [bigint]>({
    queryKey: ["last-fetched-time"],
    queryFn: async () => {
      if (!actor) return [];
      return (actor as any).getLastFetchedTime();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useFetchExternalNews() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Actor not available");
      return (actor as any).fetchExternalNews();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["external-news"] });
      queryClient.invalidateQueries({ queryKey: ["last-fetched-time"] });
    },
  });
}
