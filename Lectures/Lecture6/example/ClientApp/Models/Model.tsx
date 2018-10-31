export type Movie = {
    id:number;
    release: Date;
    title:string;
    actors: Actor[]
}

export type Actor = {
    id:number;
    birthdate: Date;
    gender:string;
    movieId: number;
    name:string;
}