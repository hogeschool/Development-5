import * as React from "react"
import * as ReactDOM from "react-dom"


export async function get_movie_info(id: number) {
  let res = await fetch(`CustomController/GetMovie/${id}`, { method: 'get', credentials: 'include', headers: { 'content-type': 'application/json' } })
  if(res.status == 404) return;
  let res1 = await res.json()
  return res1
}


export async function add_movie(title: string, genre: string) {
  let res = await fetch(`CustomController/AddMovie`, { method: 'put', body:JSON.stringify({Title:title, Genre:genre}), credentials: 'include', headers: { 'content-type': 'application/json' } })
  
}

type MCProps= { }
type MCState= { MovieInfo : "loading..." | string, AddingMovie:boolean, MovieToSearch: string, MovieToAdd: {title:string, genre:string} }

export default class MovieController extends React.Component<MCProps, MCState>{
  constructor(props: MCProps, context){
    super(props, context)
    this.state = { MovieInfo:"", MovieToSearch:"", MovieToAdd: {title:"", genre:""}, AddingMovie:false }
  }

  componentDidMount(){

  }

  render(){
    return <div> 
              <div>
                <input onChange={(event) => { this.setState({...this.state, MovieToSearch:event.target.value }) } }/>
                <button onClick={async() => {
                                          if(this.state.MovieInfo == "loading...") return;
                                          this.setState({...this.state, MovieInfo: "loading..."}, () => {
                                            get_movie_info(parseInt(this.state.MovieToSearch)).then(movie_info => {
                                              this.setState({...this.state, MovieInfo:movie_info? movie_info.title : "Movie not found"})
                                              })
                                          })
                                        }}> Search </button>
                <textarea value={this.state.MovieInfo} disabled={true}/>
              </div>

              <div>
                <input onChange={(event) => { this.setState({...this.state, MovieToAdd: {...this.state.MovieToAdd, title: event.target.value }}) } }/>
                <input onChange={(event) => { this.setState({...this.state, MovieToAdd: {...this.state.MovieToAdd, genre: event.target.value }}) } }/>
                <button onClick={async() => {
                                          if(this.state.MovieToAdd.title == "" && this.state.MovieToAdd.genre == "" || this.state.AddingMovie) return;
                                          this.setState({...this.state, AddingMovie: true}, () => {
                                            add_movie(this.state.MovieToAdd.title, this.state.MovieToAdd.genre).then(_ => {
                                              this.setState({...this.state, AddingMovie: false})
                                              })
                                          })
                                        }}> Add </button>
                <textarea value={this.state.AddingMovie?"Waiting for responce...":""} disabled={true}/>
              </div>
           </div>
  }
}




ReactDOM.render(
  <MovieController />,
  document.getElementById("root")
)