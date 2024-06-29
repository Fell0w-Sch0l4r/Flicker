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


function parseAPIMovie(apiMovie: APIMovie): Movie {
    const movie: Movie = {
        image:
            "https://image.tmdb.org/t/p/w600_and_h900_bestv2" +
            apiMovie.poster_path,
        title: apiMovie.title,
        rating: decreaseDecimalPlace(apiMovie.vote_average),
        year: parseYear(apiMovie.release_date),
        description: apiMovie.overview,
        isFavorite: false,
    };

    return movie;
}


function parseYear(date: string): number {
    let year: number = parseInt(date.split("-")[0]);
    return year;
}

function decreaseDecimalPlace(num: number): number {
    let roundedNum: number = Math.round(num * 10) / 10;
    return roundedNum;
}


function getFavoriteMoviesfromLocal(): Movie[] {
    const localMovies: string | null = localStorage.getItem("favoriteMovies");
    if (localMovies) {
        return JSON.parse(localMovies);
    }
    return [];
}

function addFavoriteMoviesToLocal(favoriteMovies: Movie[]): void {
    localStorage.setItem("favoriteMovies", JSON.stringify(favoriteMovies));
}