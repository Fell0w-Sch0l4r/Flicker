import "../styles/tailwind.css";
import Movie from "./interfaces/Movie";
import APIMovie from "./interfaces/TMDBAPIMovie";
import axios from "axios";


const searchBar = document.querySelector("form") as HTMLFormElement;
const searchInput = document.querySelector(".search") as HTMLInputElement;
const mana = document.querySelector("main") as HTMLDivElement;
const mainHeader = document.querySelector(".mainHeader") as HTMLDivElement;

const favoriteMovies: Movie[] = getFavoriteMoviesfromLocal();

const checkbox = document.querySelector(".favoriteMovies") as HTMLInputElement;


mainHeader.addEventListener("click", () => {
    getPopularMovies();
});