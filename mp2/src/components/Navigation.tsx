import React from 'react';
import styles from './Navigation.module.css';
import { Link } from 'react-router-dom'


const Navigation: React.FC = () => {
    return (
        <nav className={styles.nav}> 
            <h1 className={styles.title}>🎬 TMDB Movie</h1>
            <div className={styles.linkContainer}> 
                <Link to='/list' className={styles.link}>
                    List View
                </Link>
                <Link to='/gallery' className={styles.link}>
                    Gallery View
                </Link> 
            </div>
        </nav>
    );
};


export default Navigation;
