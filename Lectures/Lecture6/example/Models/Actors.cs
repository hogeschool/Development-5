using System;
using System.Collections.Generic;

namespace lesson6.Models
{
    public partial class Actors
    {
        public int Id { get; set; }
        public DateTime Birthdate { get; set; }
        public string Gender { get; set; }
        public int MovieId { get; set; }
        public string Name { get; set; }

        public Movies Movie { get; set; }
    }
}
