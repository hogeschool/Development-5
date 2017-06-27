using Microsoft.EntityFrameworkCore;

namespace MVC_Movie_Project.Models
{
    public class MvcMovieContext : DbContext
    {
        public MvcMovieContext (DbContextOptions<MvcMovieContext> options)
            : base(options)
        {
        }

        public DbSet<MVC_Movie_Project.Models.Movie> Movie { get; set; }
    }
}