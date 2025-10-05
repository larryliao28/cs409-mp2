import React, {useState, useEffect} from "react";
import { Movie } from '../types/movie';
import { useNavigate, useParams } from 'react-router-dom'; 
import styles from './detailView.module.css';  
import { tmbdAPI, IMAGE_URL } from "../services/tmbdAPI";

const DetailView: React.FC = () => {
    const navigate = useNavigate(); 
    const [movie, setMovie] = useState<Movie | null>(null); 
    const [loading, setLoading] = useState(false); 
    const [currentMovies, setCurrentMovies] = useState<Movie[]>([]);
    const { id } = useParams<{id: string}>(); 

    useEffect(() => {
        const storedMovies = sessionStorage.getItem('currentMovies');
        if (storedMovies) {
            setCurrentMovies(JSON.parse(storedMovies));
        }
    }, []); 

    useEffect(() => {
        if (id) {
            setLoading(true); 
            tmbdAPI.movieDetails(Number(id)).then((r) => setMovie(r.data))
            .catch((e) => console.error(e))
            .finally(() => setLoading(false));
        } 
    }, [id]);

    const currentIndex = currentMovies.findIndex((m) => m.id === Number(id));

    const goPrevious = () => {
        if (currentIndex > 0) {
            navigate(`/movie/${currentMovies[currentIndex - 1].id}`);
        }
    }; 

    const goNext = () => {
        if (currentIndex < currentMovies.length - 1) {
            navigate(`/movie/${currentMovies[currentIndex + 1].id}`);
        }
    };


    if (loading) {return <p className={styles.loading}>Loading...</p>; } 
    if (!movie) { return <p className={styles.loading}>No movie data available.</p>; }

    return ( 
        <div> 
            <button onClick={() => navigate(-1)} className={styles.backwardButton}>← Back</button>

            <div className={styles.detailContainer}>
                <img src={movie.poster_path ? `${IMAGE_URL}${movie.poster_path}`:'https://via.placeholder.com/300x450?text=No+Image'} 
                        alt = {movie.title} 
                        className={styles.posterImage} /> 
                <div className={styles.infoContainer}>
                    <h2 className={styles.title}>{movie.original_title}</h2> 
                    <p className={styles.details}><strong>Release Date:</strong> {movie.release_date || 'N/A'}</p>
                    <p className={styles.details}><strong>Rating:</strong> ⭐ {movie.vote_average.toFixed(1)}/10</p>
                    {movie.runtime && ( 
                        <div className={styles.details}><strong>Runtime:</strong> {movie.runtime} minutes</div>
                    )} 
                    {movie.origin_country && movie.origin_country.length > 0 && ( 
                        <div className={styles.details}><strong>Origin country:</strong> {movie.origin_country.join(', ')}</div>
                    )} 
                    {movie.production_companies && movie.production_companies.length > 0 && ( 
                        <div className={styles.details}> 
                            <strong>Production companies:</strong> {' '} 
                            {movie.production_companies.map((c) => c.name).join(', ')}
                        </div>
                    )}
                    <div className={styles.details}>
                        <strong>Overview:</strong> 
                        <p>{movie.overview || 'No overview available.'}</p>
                    </div>
                </div>
            </div> 
            {
                currentMovies.length > 0 && (
                    <div className={styles.navigation}>
                        <button onClick={goPrevious} disabled={currentIndex <= 0} className={`${styles.navButton}${currentIndex <= 0 ? styles.disabled : ''}`}>
                            ← Previous 
                        </button>
                        <button onClick={goNext} disabled={currentIndex >= currentMovies.length - 1} className={`${styles.navButton}${currentIndex >= currentMovies.length - 1 ? styles.disabled : ''}`}>
                            Next →
                        </button>
                    </div>
                    
            )}
        </div> 
    ); 
}; 


export default DetailView;  

