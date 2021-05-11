using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TastTask66bit.Models
{
    public class AvailableData
    {
        public readonly List<Country> Countries;
        public readonly List<Team> Teams;

        public AvailableData(List<Country> countries,List<Team> teams)
        {
            Countries = countries;
            Teams = teams;
        }
    }
}
