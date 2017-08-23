using System;
using lesson1_console.model;
using System.Collections.Generic;

namespace lesson1_console
{
    class Program
    {
        static void Main(string[] args)
        {
            //One to Many example
            // AddOneMovieAndActors();

            //Selecting data from a table
            ReadActorsData();

            //Modify a record 
            // UpdateMovie();

            //Many to Many example
            // AddMoviesAndActors();

        }


        //one to many
        static void AddOneMovieAndActors()
        {
            // using (var db = new MovieContext())
            // {
            //     Movie m = new Movie
            //     {
            //         Title = "No country for old men",
            //         Actors = new List<Actor> {
            //                              new Actor{Name = "Tommy Lee"},
            //                              new Actor{Name = "Xavier Berdem"}
            //                     }
            //     };
            //     db.Add(m);
            //     var count = db.SaveChanges();
            //     Console.WriteLine("{0} records saved to database", count);
            //     Console.WriteLine();
            //     Console.WriteLine("All movies in database:");


            //     foreach (var Movie in db.Movies)
            //     {
            //         Console.WriteLine(" - {0} ", Movie.Title);
            //     }
            // }
        }

        static void ReadActorsData()
        {
            using (var db = new MovieContext())
            {
                Console.WriteLine("Selecting actors data from table Actor :");
                Console.WriteLine("ActorId | ActorName");
                foreach (var actor in db.Actors)
                {
                    Console.WriteLine(" - {0} | {1}", actor.ActorId, actor.Name);
                }
            }
        }


        static void UpdateMovie()
        {

            using (var db = new MovieContext())
            {

                Movie foundMovie = db.Movies.Find(2);
                Console.WriteLine();
                foundMovie.Title = "White cats, Black cats...";
                int count = db.SaveChanges();
                Console.WriteLine("{0} records has been changed", count);

                foreach (var Movie in db.Movies)
                {
                    Console.WriteLine(" - {0} ", Movie.Title);
                }
            }
        }

        //many <> many
        static void AddMoviesAndActors()
        {
            using (var db = new MovieContext())
            {
                Movie m = new Movie { Title = "White cats, black cats" };
                Actor a1 = new Actor { Name = "Acotr 1" };
                Actor a2 = new Actor { Name = "Acotr 2" };

                MovieActor ma = new MovieActor();
                ma.Movie = m;
                ma.Actor = a1;

                MovieActor ma2 = new MovieActor();
                ma2.Movie = m;
                ma2.Actor = a2;

                db.Add(ma);
                db.Add(ma2);

                var count = db.SaveChanges();
                Console.WriteLine("{0} records saved to database", count);
                Console.WriteLine();
                Console.WriteLine("All movies and Actors in database:");

                foreach (var actor in db.Actors)
                {
                    Console.WriteLine(" - {0} ", actor.Name);
                }
            }
        }
    }
}

