﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;


namespace TastTask66bit.Models
{
    public class Team
    {
        [Key]
        public int ID { get; set; }
        public string Name { get; set; }
        //public List<Player> Players { get; set; }

    }
}
