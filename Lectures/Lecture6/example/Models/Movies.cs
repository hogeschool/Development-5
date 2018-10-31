using System;
using System.Collections.Generic;

namespace lesson6.Models
{
    public partial class Movies
    {

        public int Id { get; set; }
        public int ReleaseYear { get; set; }
        public string Title { get; set; }

        public List<Actors> Actors { get; set; }
    }
}
