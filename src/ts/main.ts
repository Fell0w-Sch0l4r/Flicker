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

function sameObjectMovie(movie1: Movie, movie2: Movie): boolean {
    return (
        movie1.image === movie2.image &&
        movie1.title === movie2.title &&
        movie1.rating === movie2.rating &&
        movie1.year === movie2.year &&
        movie1.description === movie2.description
    );
}


function renderMoviePoster(movie: Movie): void {
    const moviePoster: HTMLDivElement = document.createElement("div");
    moviePoster.className =
        "w-80 mb-10 size-fit flex flex-col sm:flex-row rounded-lg justify-between sm:pr-10 lg:pr-0 lg:justify-around items-center shadow-2xl sm:w-[600px] lg:w-11/12 2xl:w-7/12 lg:h-fit lg:py-5 mx-auto md:text-xl bg-slate-800";

    const image: HTMLImageElement = document.createElement("img");
    image.className = "w-80 lg:size-40 rounded-lg lg:rounded-full";

    moviePoster.appendChild(image);

    image.src = movie.image;

    // midle poster
    const midleSection: HTMLDivElement = document.createElement("div");
    midleSection.className = "w-full sm:w-fit lg:w-80 lg:h-fit mt-3 sm:mt-0";

    const title: HTMLHeadElement = document.createElement("h");
    title.textContent = `${movie.title} (${movie.year})`;
    title.className = "font-semibold text-center block sm:text-left";
    midleSection.appendChild(title);

    // Create the outer div
    const outerDiv = document.createElement("div");
    outerDiv.className = "md:mt-5";

    // Create the inner div
    const innerDiv = document.createElement("div");
    innerDiv.className = "flex sm:flex-col lg:flex-row justify-between lg:w-60";

    // Create the first span
    const starSpan = document.createElement("span");
    starSpan.className = "flex justify-between items-center w-16 md:w-20";
    starSpan.innerHTML = `<img class="size-7" src="Star.svg" alt="" /> ${movie.rating}`;

    // Create the second span
    const heartSpan = document.createElement("span") as HTMLSpanElement;
    heartSpan.className =
        "cursor-pointer flex w-24 md:w-32 justify-between items-center";

    if (movie.isFavorite) {
        heartSpan.innerHTML =
            '<img class="size-7 hidden" src="Heart.svg" alt="" /><img class="size-7" src="filledHeart.svg" alt="" /> Favorito';
    } else {
        heartSpan.innerHTML =
            '<img class="size-7" src="Heart.svg" alt="" /><img class="size-7 hidden" src="filledHeart.svg" alt="" /> Favorito';
    }

    heartSpan.addEventListener("click", () => {
        console.log(movie);
        if (heartSpan.children[1].classList.contains("hidden")) {
            movie.isFavorite = true;
            favoriteMovies.push(movie);
            addFavoriteMoviesToLocal(favoriteMovies);

            heartSpan.children[1].classList.remove("hidden");
            heartSpan.children[0].classList.add("hidden");
        } else {
            for (let index = 0; index < favoriteMovies.length; index++) {
                if (sameObjectMovie(movie, favoriteMovies[index])) {
                    favoriteMovies.splice(index, 1);
                    addFavoriteMoviesToLocal(favoriteMovies);
                    break;
                }
            }
            heartSpan.children[1].classList.add("hidden");
            heartSpan.children[0].classList.remove("hidden");
        }
    });

    // Append the spans to the inner div
    innerDiv.appendChild(starSpan);
    innerDiv.appendChild(heartSpan);

    // Append the inner div to the outer div
    outerDiv.appendChild(innerDiv);
    midleSection.appendChild(outerDiv);

    moviePoster.appendChild(midleSection);

    // paragraph
    const paragraph: HTMLParagraphElement = document.createElement("p");
    paragraph.textContent = movie.description;
    paragraph.className = "h-fit w-6/12 font-semibold hidden lg:flex";
    moviePoster.appendChild(paragraph);

    document.querySelector("main")?.appendChild(moviePoster);
}


function getPopularMovies() {
    const options = {
        method: "GET",
        url: "https://api.themoviedb.org/3/movie/popular",
        params: { language: "en-US", page: "1" },
        headers: {
            accept: "application/json",
            Authorization: "Bearer " + import.meta.env.VITE_TMDB_TOKEN,
        },
    };

    axios
        .request(options)
        .then(function (response) {
            const apiMovies: APIMovie[] = response.data.results;
            //console.log(apiMovies)

            const movies: Movie[] = [];

            for (const apiMovie of apiMovies) {
                const movie: Movie = parseAPIMovie(apiMovie);
                movies.push(movie);
            }

            console.log(movies);

            mana.innerHTML = "";

            for (const movie of movies) {
                renderMoviePoster(movie);
            }
        })
        .catch(function (error) {
            console.error(error);
        });
}