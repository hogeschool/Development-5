using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace lesson2_linq.model {
    class MovieContext : DbContext {
        public DbSet<Movie> Movies { get; set; }
        public DbSet<Actor> Actors { get; set; }


        protected override void OnConfiguring (DbContextOptionsBuilder optionsBuilder) {
            optionsBuilder.UseSqlite ("Data Source=Movie.db");
        }

        protected override void OnModelCreating (ModelBuilder modelBuilder) {
            modelBuilder.Entity<Actor> ()
                .HasOne(m => m.Movie)
                .WithMany (a => a.Actors)
                .HasForeignKey (m => m.MovieId);
        }
    }

    public class Movie {

        public int MovieId { get; set; }

        public string Title { get; set; }

        public DateTime Release { get; set; }

        public List<Actor> Actors { get; set; }
    }

    public class Actor {
        public int ActorId { get; set; }

        public string Name { get; set; }

        public DateTime Birth { get; set; }

        public string Gender { get; set; }

        public int MovieId { get; set; }

        public Movie Movie { get; set; }

    }
}