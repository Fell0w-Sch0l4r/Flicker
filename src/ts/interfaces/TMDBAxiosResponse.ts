import APIMovie from "./TMDBAPIMovie";

export default interface TMDBAxiosResponse {
    page: number;
    results: APIMovie[];
    total_pages: number;
    total_results: number
}