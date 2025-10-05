import React, {useState, useEffect, useRef, useCallback} from "react";
import { Movie, Genre } from '../types/movie'; 
import { useNavigate } from 'react-router-dom'; 
import styles from './galleryView.module.css'; 
import { tmbdAPI, IMAGE_URL } from "../services/tmbdAPI";

const GalleryView: React.FC = () => { 
    const [movies, setMovies] = useState<Movie[]>([]);
    const [loading, setLoading] = useState(false); 
    const navigate = useNavigate(); 
    const [genres, setGenres] = useState<Genre[]>([]);
    const [selected, setSelected] = useState<number | null>(null); 

    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const observerRef = useRef<IntersectionObserver | null>(null);

    //genre
    useEffect(() => {
        tmbdAPI.getGenres().then((r) => setGenres(r.data.genres))
        .catch((err) => console.error(err))
    }, []); 

    //movies 
    useEffect(() => {
        setLoading(true);
        tmbdAPI.discoverMovies(selected ? [selected] : [], page).then((r) => {
            const newMovies = r.data.results || [];
            setMovies((prev) => {
                const updated = page === 1 ? newMovies : [...prev, ...newMovies]; 
                sessionStorage.setItem('currentMovies', JSON.stringify(updated));
                return updated; 
            });
            setHasMore(page < r.data.total_pages);
        }).catch((err) => console.log(err)).finally(() => setLoading(false))
    }, [selected, page]); 

    const changeGenre = (genreID: number) => { 
        setSelected((prev) =>  (prev === genreID ? null : genreID)); 
        setPage(1); 
    }; 

    //same as listView to direct to detail 
    const handleMovieClick = (id: number) => {
        sessionStorage.setItem('currentMovies', JSON.stringify(movies)); 
        navigate(`/movie/${id}`); 
    }; 

    const lastMovieReference = useCallback(
        (node : HTMLDivElement | null) => {
            if (loading) return;
            if (observerRef.current) observerRef.current.disconnect();
            
            observerRef.current = new IntersectionObserver((entries) =>  {
                if (entries[0].isIntersecting && hasMore) {
                    setPage((prev) => prev + 1);
                }
            });

            if (node) observerRef.current.observe(node);
        }, [loading, hasMore]
    ); 

    return (
        <div> 
            <h1 className={styles.heading}>Gallery</h1>  
            <div className={styles.genreContainer}> 
                <h3 className={styles.subTitle}>Filter by Genre:</h3>
                <div className={styles.buttonContainer}>
                    {genres.map((genre) => ( 
                        <button key = {genre.id} onClick={() => changeGenre(genre.id)}
                            className={`${styles.genreButton} ${selected === genre.id ? styles.active : ''}`}
                        > 
                        {genre.name} 
                        </button>  
                    ))}
                </div> 
            </div> 

            {loading && <p className={styles.loading}>Loading...</p>}

            <div className={styles.galleryContainer}> 
                {movies.map((movie, index) => {
                    const isLast = index === movies.length - 1;
                    return (
                        <div key={movie.id} ref={isLast ? lastMovieReference : null} onClick={() => handleMovieClick(movie.id)} className={styles.movie}> 
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
                    );
                })}
            </div>
            
        </div> 
    ); 
}; 

export default GalleryView;  
