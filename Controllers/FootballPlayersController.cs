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
            var Teams = dbContext.Teams.Where(name => name.Name.StartsWith(Prefix)).Select(selector => selector.Name);
            var result = Teams.ToArray();
            return Json(result);
        }

        [HttpPost]
        public JsonResult RegisterNewPlayer(string firstName, string lastName, int sex, DateTime birthDate, string country, string team)
        {
            Player player = new Player();
            player.FirstName = firstName;
            player.LastName = lastName;
            player.IsMale = (sex == 0);
            player.BirthDate = birthDate;
            player.Country = dbContext.Countries.Where(d => d.Name == country).FirstOrDefault();
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
            var Result = dbContext.Players.Include(c => c.Country).Include(t => t.Team).ToArray().Reverse().Skip(min * (page-1)).Take(min).ToArray();
            
            return Json(new Dictionary<string,object> { { "Available",dbContext.Players.Count() }, { "Result", Result } });
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public JsonResult RequestPlayerByPartOfName(string part)
        {
            var Result = dbContext.Players.Include(c => c.Country).Include(t => t.Team).ToArray().Reverse().Where(d => d.FirstName.Contains(part) || d.LastName.Contains(part) || d.Team.Name.Contains(part));

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
