using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TastTask66bit.Models;
using Microsoft.EntityFrameworkCore;

namespace TastTask66bit
{
    public class DataBase : DbContext
    {
        public DbSet<Player> Players { get; set; }
        public DbSet<Team> Teams { get; set; }
        public DbSet<Country> Countries { get; set; }

        public DataBase(DbContextOptions options) :base(options) { 
            
        }



        public DataBase():base() { }
        


        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Player>()
                .HasOne(p => p.Team);

            modelBuilder.Entity<Player>()
                .HasOne(p => p.Country);
        }

        public Team GetTeamByNameOrCreate(string teamName)
        {
            if (Teams.Any(team => team.Name == teamName))
                return Teams.Where(team => team.Name == teamName).FirstOrDefault();

            Team team = new Team();
            team.Name = teamName;
            Teams.Add(team);
            return team;
        }
    }
}
