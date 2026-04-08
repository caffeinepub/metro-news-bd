import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Article, LocalNewsArticle } from "../types";
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

export interface BackendActor {
  getAllArticles(): Promise<Article[]>;
  getFeaturedArticles(): Promise<Article[]>;
  createArticle(
    title: string,
    summary: string,
    category: string,
    imageUrl: string,
    author: string,
    isFeatured: boolean,
  ): Promise<bigint>;
  getExternalNews(): Promise<ExternalNews[]>;
  getLastFetchedTime(): Promise<[] | [bigint]>;
  fetchExternalNews(): Promise<void>;
  getAllLocalNews(): Promise<LocalNewsArticle[]>;
  addLocalNews(
    title: string,
    summary: string,
    category: string,
    imageBase64: string,
    author: string,
    sourceName: string,
    sourceUrl: string,
  ): Promise<bigint>;
  deleteLocalNews(id: bigint): Promise<void>;
  getLocalNewsByDateRange(
    from: bigint,
    to: bigint,
  ): Promise<LocalNewsArticle[]>;
  searchLocalNews(keyword: string): Promise<LocalNewsArticle[]>;
}

function castActor(actor: unknown): BackendActor {
  return actor as BackendActor;
}

export function useGetAllArticles() {
  const { actor, isFetching } = useActor();
  return useQuery<Article[]>({
    queryKey: ["articles"],
    queryFn: async () => {
      if (!actor) return [];
      return castActor(actor).getAllArticles();
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
      return castActor(actor).getFeaturedArticles();
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
      return castActor(actor).createArticle(
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
      return castActor(actor).getExternalNews();
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 60 * 60 * 1000, // প্রতি ১ ঘন্টায় স্বয়ংক্রিয় আপডেট
  });
}

export function useGetLastFetchedTime() {
  const { actor, isFetching } = useActor();
  return useQuery<[] | [bigint]>({
    queryKey: ["last-fetched-time"],
    queryFn: async () => {
      if (!actor) return [];
      return castActor(actor).getLastFetchedTime();
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
      return castActor(actor).fetchExternalNews();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["external-news"] });
      queryClient.invalidateQueries({ queryKey: ["last-fetched-time"] });
    },
  });
}
