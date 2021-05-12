using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using TastTask66bit.Models;
using Microsoft.EntityFrameworkCore;

namespace TastTask66bit.Controllers
{
    public class HomeController : Controller
    {
        private readonly DataBase db;


        public HomeController(DataBase dbContext)
        {
            db = dbContext;
        }

        public IActionResult Index()
        {
            return View();
        }

        public IActionResult NewFootballPlayer()
        {
            
            return View(db.Countries.ToArray()); 
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }

        public IActionResult FootballPlayerList()
        {
            return View(db.Countries.ToArray());
        }
    }
}
