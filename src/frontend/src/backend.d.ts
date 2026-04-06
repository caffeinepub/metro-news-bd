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
export interface backendInterface {
    addAdmin(admin: Principal): Promise<void>;
    createArticle(title: string, summary: string, category: string, imageUrl: string, author: string, isFeatured: boolean): Promise<bigint>;
    createBreakingNews(text: string): Promise<bigint>;
    getAllArticles(): Promise<Array<Article>>;
    getAllBreakingNews(): Promise<Array<BreakingNews>>;
    getArticle(id: bigint): Promise<Article>;
    getFeaturedArticles(): Promise<Array<Article>>;
}
