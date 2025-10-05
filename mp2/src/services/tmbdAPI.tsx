import axios from 'axios';

const APIkey = 'b9f88e74915d7ab1e9a2847d8f8e7b66';
const baseURL = 'https://api.themoviedb.org/3'; 

export const IMAGE_URL = 'https://image.tmdb.org/t/p/w500'; 

export const tmbdAPI = {
    findMovies: (query:string) => 
        axios.get(`${baseURL}/search/movie?api_key=${APIkey}&language=en-US&query=${encodeURIComponent(query)}`),

    getGenres: () => 
        axios.get(`${baseURL}/genre/movie/list?api_key=${APIkey}`), 

    discoverMovies: (genres:number[], page:number = 1) => { 
        const genreQuery = genres.length > 0 ? `&with_genres=${genres.join(',')}`: ''; 
        return axios.get(`${baseURL}/discover/movie?api_key=${APIkey}${genreQuery}&language=en-US&sort_by=popularity.desc&page=${page}${genreQuery}`)
    },

    movieDetails: (id:number) => 
        axios.get(`${baseURL}/movie/${id}?api_key=${APIkey}&language=en-US`)


}; 