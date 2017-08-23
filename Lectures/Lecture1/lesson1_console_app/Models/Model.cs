using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;

namespace lesson1_console.model
{

    public class MovieContext : DbContext
    {
        public DbSet<Movie> Movies { get; set; }
        public DbSet<Actor> Actors { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseSqlite("Data Source=Movie.db");
        }


        /***
         *  implementing many<>many relationship using entity class MovieActos
         *  Remove this method if you want to test one<>many relationships
         **/
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<MovieActor>()
                .HasKey(ma => new { ma.MovieId, ma.ActorId });

            modelBuilder.Entity<MovieActor>()
                .HasOne(m => m.Movie)
                .WithMany(r => r.MovieActors)
                .HasForeignKey(m => m.MovieId);

            modelBuilder.Entity<MovieActor>()
                .HasOne(a => a.Actor)
                .WithMany(r => r.MovieActors)
                .HasForeignKey(a => a.ActorId);
        }

    }

    public class Movie
    {

        public int MovieId { get; set; }
        public string Title { get; set; }
        public List<MovieActor> MovieActors { get; set; }
    }

    public class Actor
    {
        public int ActorId { get; set; }
        public string Name { get; set; }

        public List<MovieActor> MovieActors { get; set; }
    }

    //remove this entity if you want one<>many relation ship
    public class MovieActor
    {
        public int MovieId { get; set; }
        public Movie Movie { get; set; }
        public int ActorId { get; set; }
        public Actor Actor { get; set; }
    }
}