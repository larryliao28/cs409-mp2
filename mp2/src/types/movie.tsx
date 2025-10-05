export interface Movie {
    id : number;
    popularity: number; 
    vote_average: number;
    poster_path: string | null; 
    title: string;
    release_date: string; 
    original_title: string;
    runtime?: number; 
    origin_country: string[]; 
    production_companies?:{ name:string }[]; 
    overview: string;
}

export interface Genre {
    id: number;
    name: string; 
}