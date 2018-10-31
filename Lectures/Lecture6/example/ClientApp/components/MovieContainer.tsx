import * as Modeis from "../Models/Model";
import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import 'isomorphic-fetch';
import * as Immutable from "immutable";

type Movie = Modeis.Movie;
type Actor = Modeis.Actor;
type MovieState = { movieList:  Immutable.List<Movie> | "Loading" } 


export class MovieContainer extends React.Component<RouteComponentProps<{}>, MovieState>{
    constructor(){
        super();
        this.state = {movieList : "Loading"}
    }

    private loadMovies = async function (): Promise<Immutable.List<Movie>> {
        let res: Response = await fetch("./api/movies", {method:"GET",headers:{"content-type":"application/json"}});
        let movies: Promise<Immutable.List<Movie>> = await res.json();
        return movies;
    }

    componentWillMount():void{
        this.loadMovies().then(data => (this.setState({...this.state, movieList: Immutable.List<Movie>(data)})))
                        .catch(Error => console.error(Error));
    }

    private renderMoviesTable(ml:Immutable.List<Movie>) : JSX.Element{
        return (
            <table className="table">
            <thead>
                <tr>
                    <th>Title</th>
                    <th>Release</th>
                    <th>Actors</th>
                </tr>
            </thead>
            <tbody>
                {ml.map( (m: Movie ) => (<MovieRow  movieP={m} /> ))}
            </tbody>
            </table>
        );
    }
//ternary
    public render() : JSX.Element  {
        let content  = this.state.movieList == "Loading" ? (<p>Loading....</p>)
                                                         : (this.renderMoviesTable(this.state.movieList))  
        return (<div>
            <h1>Movies</h1>
            <p>This component will fetch movie data from the the server</p>
            {content}
        </div>);
    }
}


type MovieRProps = { movieP : Movie };
type MovieRState = {viewActors:boolean}

export class MovieRow extends React.Component<MovieRProps, MovieRState>{
    constructor(){
        super();
        this.state = {viewActors:false}
        
    }

    viewActors = function(this: MovieRow): void{
        let movie = this.props.movieP;
        this.setState({...this.state, viewActors: !this.state.viewActors}); 
    }

    render(): JSX.Element{
        let movie = this.props.movieP;
        return(
            <tr key={movie.id}>
                <td>{movie.title}</td>
                <td>{movie.release}</td>
                <td>{!this.state.viewActors ? <button onClick={() => this.viewActors()}>+</button> 
                                                : <button onClick={() => this.viewActors()}>-</button> }
                                    <div>{this.state.viewActors? movie.actors.map((a:Actor) => <p>{a.name}</p>) : <div/>}</div>
                                            </td>
            </tr>
        )

    }
}