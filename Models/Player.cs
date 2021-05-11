using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TastTask66bit.Models
{
    public class Player
    {
        public int ID { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public bool IsMale { get; set; }
        public DateTime BirthDate { get; set; }
        public Team Team { get; set; }
        public Country Country { get; set; }
    }
}
