import React, {useState, useEffect} from "react";
import { Movie } from '../types/movie';
import { useNavigate } from 'react-router-dom'; 
import styles from './listView.module.css'; 
import { tmbdAPI, IMAGE_URL } from "../services/tmbdAPI";


const ListView: React.FC = () => {
    const [movies, setMovies] = useState<Movie[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState<'popularity'| 'rating'>('popularity');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
    const [loading, setLoading] = useState(false); 
    const navigate = useNavigate(); 

    useEffect(() => {
        if (searchQuery.length > 0) {
            setLoading(true); 
            const timer = setTimeout(() => {
                tmbdAPI.findMovies(searchQuery)
                .then((response) => {
                    console.log("TMDB Response:", response.data);
                    setMovies(response.data.results || []);
                    sessionStorage.setItem('currentMovies', JSON.stringify(response.data.results || []));
                }) 
                .catch((e) => console.error(e)) 
                .finally(() => setLoading(false))
            }, 300);
            return () => clearTimeout(timer); 
        } else {
            setMovies([]); 
            sessionStorage.removeItem('currentMovies'); 
            setLoading(false);
        }
    }, [searchQuery])

    const sortMovies = [...movies].sort((a, b) =>  { 
        let compare = 0; 
        switch (sortBy) { 
            case 'popularity':
                compare = a.popularity - b.popularity; 
                break; 
            case 'rating':
                compare = a.vote_average - b.vote_average; 
                break;
        }
        return sortOrder === 'asc' ? compare : -compare; 
    });

    const handleMovieClick = (id: number) => {
        sessionStorage.setItem('currentMovies', JSON.stringify(sortMovies)); 
        navigate(`/movie/${id}`); 
    }; 

    return (
        <div>
            <h2 className={styles.head}>Search Movies</h2>

            <input type="text" placeholder="search for movie name" 
            value={searchQuery} onChange={(m) => setSearchQuery(m.target.value)}  
            className={styles.input}/> 

            <div className={styles.sortContainer}> 
                <label className={styles.label}>Sort by:</label>
                <select value={sortBy} onChange={(c) => setSortBy(c.target.value as any)} className={styles.select}>
                    <option value='popularity'>Popularity</option> 
                    <option value='rating'>Rating</option> 
                </select> 
                <select value={sortOrder} onChange={(s) => setSortOrder(s.target.value as any)} className={styles.select}>
                    <option value='asc'>Ascending</option> 
                    <option value='desc'>Descending</option> 
                </select> 
            </div>

            {loading && <p className={styles.loading}>Loading...</p>}
            
            <div> 
                {sortMovies.map((movie) => ( 
                    <div key={movie.id} onClick={() => handleMovieClick(movie.id)} className={styles.moviePoster}>
                        <img src={movie.poster_path ? `${IMAGE_URL}${movie.poster_path}`:'https://via.placeholder.com/300x450?text=No+Image'} 
                        alt = {movie.title} 
                        className={styles.posterImage} /> 
                        <div className={styles.movieInformation}>
                            <h3 className={styles.movieTitle}>{movie.title}</h3>
                            <p className={styles.rating}>⭐ Rating: {movie.vote_average != null ? movie.vote_average.toFixed(1) : 'N/A'}/10</p>
                            <p className={styles.movieDetail}>Release: {movie.release_date || 'N/A'}</p>
                            <p className={styles.movieDetail}>Popularity: {movie.popularity != null ? movie.popularity.toFixed(0) : 'N/A'}</p>
                        </div> 
                    </div> 
                ))}
                {searchQuery && sortMovies.length === 0 && !loading && (
                    <p className={styles.noResults}>No available movies found</p>
                )}
            </div>

        </div>
    ); 

     
};

export default ListView; 