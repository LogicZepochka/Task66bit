using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TastTask66bit.Models;
using Microsoft.EntityFrameworkCore;

namespace TastTask66bit.Controllers
{
    public class FootballPlayersController : Controller
    {
        private readonly DataBase dbContext;

        public FootballPlayersController(DataBase dbContext)
        {
            this.dbContext = dbContext;
        }

        [HttpPost]
        public JsonResult GetTeamName(string Prefix)
        {
            var Teams = dbContext.Teams.
                Where(team => team.Name.StartsWith(Prefix) || team.Name.Contains(Prefix)).
                Select(selector => selector.Name);
            var result = Teams.ToArray();
            return Json(result);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public JsonResult RegisterNewPlayer(string firstName, string lastName, int sex, DateTime birthDate, string country, string team)
        {
            Player player = new Player
            {
                FirstName = firstName,
                LastName = lastName,
                IsMale = (sex == 0),
                BirthDate = birthDate,
                Country = dbContext.Countries.Where(d => d.Name == country).FirstOrDefault()
            };
            Team playerTeam = dbContext.GetTeamByNameOrCreate(team);
            player.Team = playerTeam;
            dbContext.Players.Add(player);
            dbContext.SaveChanges();
            return Json(new string[] { "OK" , player.ID.ToString()});
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public JsonResult RequestPlayersPage(int page,int min)
        {
            var Result = dbContext.Players.
                Include(c => c.Country).
                Include(t => t.Team).ToArray().Reverse().
                Skip(min * (page-1)).Take(min).ToArray();
            
            return Json(new Dictionary<string,object> { { "Available",dbContext.Players.Count() }, { "Result", Result } });
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public JsonResult RequestPlayerByPartOfNameOrTeam(string searchText)
        {
            var Result = dbContext.Players.
                Include(c => c.Country).
                Include(t => t.Team).ToArray().Reverse().
                Where(d => d.FirstName.Contains(searchText) || d.LastName.Contains(searchText) || d.Team.Name.Contains(searchText));

            return Json(new Dictionary<string, object> { { "Available", dbContext.Players.Count() }, { "Result", Result } });
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public JsonResult UpdatePlayer(int id, string firstName, string lastName, int sex, DateTime birthDate, string country, string team)
        {
            Player player = dbContext.Players.Where(pl => pl.ID == id).FirstOrDefault();
            player.FirstName = firstName;
            player.LastName = lastName;
            player.IsMale = (sex == 0);
            player.BirthDate = birthDate;
            player.Country = dbContext.Countries.Where(d => d.Name == country).FirstOrDefault();
            Team playerTeam = dbContext.GetTeamByNameOrCreate(team);
            player.Team = playerTeam;
            dbContext.SaveChanges();
            return Json(new string[] { "OK", player.ID.ToString() });
        }
    }
}
