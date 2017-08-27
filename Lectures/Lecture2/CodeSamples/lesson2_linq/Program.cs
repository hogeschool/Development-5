using System;
using System.Collections.Generic;
using System.Linq;
using lesson2_linq.model;

namespace lesson2_linq {
    class Program {

        /**
         * Projection
         * Projection with ordering : select * from movies order by
         * Grouping : select * from movies group by
         * Grouping and filtering : select * from movies group by having 
         * Join : select * from movies natrual join actors
         * Joins with filtering:  select * from movies natrual join actors where release > 2000
         * Subquery : select * from movies where movies.actorid in (select actorid from actors where birthdate > 01-01-1960 
         * Partitioning
         * Conversion toList (), ToDictionary ()
         * Value queries : return a single value : First, FirstOrDefault, Last
         * Aggregation : Aggregate, Count, LongCount, Min, Max, Sum, Average
         **/

        static void Main (string[] args) {

            // Insert some data to query the database
            // InsertMovies();

            // Projection();
            // Join ();
            SubqueryAndAggregation();

        }

        static void Projection () {

            // SELECT id,title,release FROM movies AS m;           
            using (var db = new MovieContext ()) {
                IQueryable<Movie> source1 = db.Movies;
                IQueryable<Actor> source2 = db.Actors;


                // Projection 
                IQueryable<Movie> results = from m in source1 
                                            select m;

                
                /** 
                 * Projection with filtering
                 * SELECT id,title,release FROM movies AS m WHERE m.release > 2000;  
                */

                // IQueryable<Movie> results = (from m in source1 where m.Release > new DateTime (2000, 1, 1) select m);


                /**
                 *  Projection with ordering
                 * SELECT id,title,release FROM movies AS m WHERE release > 01-01-2000 ORDER BY m.release DESC;  
                **/

                // IQueryable<Movie> results = (from m in source1 where m.Release > new DateTime (2000, 1, 1) orderby m.Release descending select m);


                Console.WriteLine ("Movie title | Release");
                foreach (var movie in results) {
                    Console.WriteLine ("- {0} | {1} ", movie.Title, movie.Release);

                    //not working
                    //    foreach(var actor in movie.Actors){
                    //        Console.WriteLine(actor);
                    //    }
                }

            }
        }


       

        static void Join () {
            using (var db = new MovieContext ()) {
                IQueryable<Movie> source1 = db.Movies;
                IQueryable<Actor> source2 = db.Actors;

                /**
                 * No natural join support
                 * 
                 */

                // var query = source1.AsQueryable().Join(source2,
                //     movie => movie.MovieId,
                //     actor => actor.MovieId,
                //     (movie, actor) =>
                //         new { Title = movie.Title, ActorName = actor.Name });


                /**
                 *  Explicit JOIN
                 *  SELECT movies.Title, actors.Name from movies INNER JOIN actors ON movies.movieId == actors.movieId 
                 */

                // var Explicit = from movie in source1
                //              join actor in source2 on movie.MovieId equals actor.MovieId 
                //              select new {
                //                   Title = movie.Title, ActorName = actor.Name 
                //              };

                 /**
                 *  Implicit JOIN
                 *  SELECT movies.Title, actors.Name FROM movies, actors WHERE movies.movieId == actors.movieId 
                 */
                
                var Implicit = from movie in source1
                                from actor in source2
                                where movie.MovieId == actor.MovieId
                                select new {
                                    Title = movie.Title, ActorName = actor.Name
                                };

                 /**
                 *  Implicit JOIN
                 *  SELECT movies.Title, actors.Name FROM movies LEFT OUTER JOIN actors ON movies.movieId == actors.movieId 
                 */

                // var Outer = from movie in source1
                //             join actor in source2 on movie.MovieId equals actor.MovieId into MovieActor
                //             from sub in MovieActor.DefaultIfEmpty()
                //                 select new { 
                //                     movie.Title, 
                //                     ActorName = sub?.Name ?? String.Empty
                //                     };

                Console.WriteLine ("Movie title | Actor name");
                foreach (var movie in Implicit) {
                    Console.WriteLine ("- {0} | {1} ", movie.Title, movie.ActorName);
                }
            }
        }

        static void SubqueryAndAggregation () {

            using (var db = new MovieContext ()) {
                IQueryable<Movie> source1 = db.Movies;
                IQueryable<Actor> source2 = db.Actors;


                /**
                 *  Subquery
                 *  
                */

                // TODO: Improve this example 
                var Subquery = from movie in source1
                                join actor in source2 on movie.MovieId equals actor.MovieId into MovieActor
                                select new {
                                    Title = movie.Title,
                                    //Aggregation
                                    ActorsNr = MovieActor.Count ()
                                };

                var Query = from movie in Subquery
                                 where movie.ActorsNr < 3
                                 select movie;

                Console.WriteLine ("Movie title | Actors-Nr");
                foreach (var movie in Query) {
                    Console.WriteLine ("{0} | {1} ", movie.Title, movie.ActorsNr);
                }

            }
        }

        static void InsertMovies () {

            using (var db = new MovieContext ()) {
                Movie m1 = new Movie {
                Title = "Mission Impossible 1",
                Release = new DateTime (1993, 1, 19),
                Actors = new List<Actor> {
                new Actor { Name = "Tom Cruise", Birth = new DateTime (1966, 1, 1), Gender = "Male" },
                new Actor { Name = "Jean Reno", Birth = new DateTime (1960, 2, 1), Gender = "Male" },
                new Actor { Name = "Emmanuelle Beart", Birth = new DateTime (1970, 1, 1), Gender = "Female" }
                }
                };

                Movie m2 = new Movie {
                    Title = "No Country for old men",
                    Release = new DateTime (2014, 5, 1),
                    Actors = new List<Actor> {
                    new Actor { Name = "Xavier Bardem", Birth = new DateTime (1972, 3, 11), Gender = "Male" },
                    new Actor { Name = "Josh Brolin", Birth = new DateTime (1966, 10, 2), Gender = "Male" },
                    new Actor { Name = "Kelly Macdonald", Birth = new DateTime (1975, 2, 3), Gender = "Female" }
                    }
                };

                Movie m3 = new Movie {
                    Title = "War for the Planet of the Apes",
                    Release = new DateTime (2017, 8, 1),
                    Actors = new List<Actor> {
                    new Actor { Name = "Woody Harrelson", Birth = new DateTime (1962, 9, 20), Gender = "Male" },
                    new Actor { Name = "Andy Serkis", Birth = new DateTime (1980, 2, 1), Gender = "Male" },
                    }
                };

                db.Add (m1);
                db.Add (m2);
                db.Add (m3);
                int count = db.SaveChanges ();
                Console.WriteLine ("{0} movies has been inserted", count);
            }
        }
    }
}