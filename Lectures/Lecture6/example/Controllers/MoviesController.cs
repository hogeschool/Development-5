using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using lesson6.Models;

namespace lesson6.Controllers
{
    [Route("api/[controller]")]
    public class MoviesController : Controller
    {
        private MovieContext _context;

        public MoviesController(MovieContext context){
           this._context = context;
       } 

        [HttpGet]
        public IActionResult Get(){
            var res = from movie in _context.Movies
                        join actor in _context.Actors
                            on movie.Id equals actor.MovieId into actorGrp
                        select new {
                            Id = movie.Id,
                            Title = movie.Title,
                            Release = movie.ReleaseYear,
                            Actors = actorGrp.ToList()
                        };
            return new OkObjectResult(res);
        }
    }
}