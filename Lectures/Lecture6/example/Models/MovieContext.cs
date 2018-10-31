using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;

namespace lesson6.Models
{
    public partial class MovieContext : DbContext
    {
        public virtual DbSet<Actors> Actors { get; set; }
        public virtual DbSet<Movies> Movies { get; set; }

        public MovieContext(DbContextOptions op):base(op){}

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Actors>(entity =>
            {
                entity.HasKey(e => e.Id);

                entity.HasIndex(e => e.MovieId);

                entity.HasOne(d => d.Movie)
                    .WithMany(p => p.Actors)
                    .HasForeignKey(d => d.MovieId);
            });

            modelBuilder.Entity<Movies>(entity =>
            {
                entity.HasKey(e => e.Id);
            });
        }
    }
}
