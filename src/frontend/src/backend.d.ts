import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
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
export type Time = bigint;
export interface BreakingNews {
    id: bigint;
    createdAt: Time;
    text: string;
}
export interface LocalNewsArticle {
    id: bigint;
    title: string;
    publishedAt: Time;
    sourceUrl: string;
    sourceName: string;
    author: string;
    summary: string;
    imageBase64: string;
    category: string;
}
export interface ExternalNews {
    id: bigint;
    title: string;
    fetchedAt: Time;
    sourceUrl: string;
    sourceName: string;
    summary: string;
    category: string;
}
export interface HttpResponse {
    status: bigint;
    body: Uint8Array;
    headers: Array<HttpHeader>;
}
export interface HttpHeader {
    value: string;
    name: string;
}
export interface TransformArgs {
    context: Uint8Array;
    response: HttpResponse;
}
export interface backendInterface {
    addAdmin(admin: Principal): Promise<void>;
    addLocalNews(title: string, summary: string, category: string, imageBase64: string, author: string, sourceName: string, sourceUrl: string): Promise<bigint>;
    createArticle(title: string, summary: string, category: string, imageUrl: string, author: string, isFeatured: boolean): Promise<bigint>;
    createBreakingNews(text: string): Promise<bigint>;
    deleteLocalNews(id: bigint): Promise<boolean>;
    fetchExternalNews(): Promise<bigint>;
    getAllArticles(): Promise<Array<Article>>;
    getAllBreakingNews(): Promise<Array<BreakingNews>>;
    getAllLocalNews(): Promise<Array<LocalNewsArticle>>;
    getArticle(id: bigint): Promise<Article>;
    getExternalNews(): Promise<Array<ExternalNews>>;
    getFeaturedArticles(): Promise<Array<Article>>;
    getLastFetchedTime(): Promise<Time | null>;
    getLocalNewsByDateRange(fromTimestamp: Time, toTimestamp: Time): Promise<Array<LocalNewsArticle>>;
    searchLocalNews(keyword: string): Promise<Array<LocalNewsArticle>>;
    transform(args: TransformArgs): Promise<HttpResponse>;
}
