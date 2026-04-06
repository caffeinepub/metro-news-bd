import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface BreakingNews {
    id: bigint;
    createdAt: Time;
    text: string;
}
export type Time = bigint;
export interface Article {
    id: bigint;
    title: string;
    publishedAt: Time;
    author: string;
    summary: string;
    imageUrl: string;
    isFeatured: boolean;
    category: string;
}
export interface ExternalNews {
    id: bigint;
    title: string;
    summary: string;
    sourceUrl: string;
    sourceName: string;
    category: string;
    fetchedAt: Time;
}
export interface LocalNewsArticle {
    id: bigint;
    title: string;
    summary: string;
    category: string;
    imageBase64: string;
    author: string;
    sourceName: string;
    sourceUrl: string;
    publishedAt: Time;
}
export interface backendInterface {
    addAdmin(admin: Principal): Promise<void>;
    createArticle(title: string, summary: string, category: string, imageUrl: string, author: string, isFeatured: boolean): Promise<bigint>;
    createBreakingNews(text: string): Promise<bigint>;
    fetchExternalNews(): Promise<bigint>;
    getAllArticles(): Promise<Array<Article>>;
    getAllBreakingNews(): Promise<Array<BreakingNews>>;
    getArticle(id: bigint): Promise<Article>;
    getExternalNews(): Promise<Array<ExternalNews>>;
    getFeaturedArticles(): Promise<Array<Article>>;
    getLastFetchedTime(): Promise<[] | [Time]>;
    addLocalNews(title: string, summary: string, category: string, imageBase64: string, author: string, sourceName: string, sourceUrl: string): Promise<bigint>;
    getAllLocalNews(): Promise<Array<LocalNewsArticle>>;
    deleteLocalNews(id: bigint): Promise<boolean>;
    searchLocalNews(keyword: string): Promise<Array<LocalNewsArticle>>;
    getLocalNewsByDateRange(fromTimestamp: bigint, toTimestamp: bigint): Promise<Array<LocalNewsArticle>>;
}
