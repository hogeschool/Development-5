using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using MVC_Movie_Project.Models;

namespace MVC_Movie_Project.Controllers
{

public class NewMovie {
  public string Title {get;set;}
  public string Genre { get; set;}
}
[Route("CustomController")]
public class CustomController : Controller{
  public readonly MvcMovieContext _context;

  public CustomController(MvcMovieContext context)
  {
    _context = context;
  }
    [HttpGet("GetMovie/{movie_id}")]
    public IActionResult GetMovie(int movie_id)
    {
      var movie = _context.Movie.FirstOrDefault(_movie => _movie.ID == movie_id);
      if(movie == null) return NotFound();
      return Ok(movie);
    }

    [HttpPut("AddMovie")]    
    public async Task<IActionResult> AddMovie([FromBody] NewMovie newMovie){
      Movie movie_to_add = new Movie(){ID=_context.Movie.Count() + 1, Title = newMovie.Title, Genre=newMovie.Genre};
      Console.WriteLine(movie_to_add.ID);
      await Task.Delay(5000);

      _context.Movie.Add(movie_to_add);
      _context.SaveChanges();
      return Ok();
    }
  }
}