using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using lesson6.Models;

namespace lesson6.Controllers
{
    [Route("api/[controller]")]
    public class ActorsController : Controller
    {
        private MovieContext _context;

        public ActorsController(MovieContext context){
           this._context = context;
       } 

        [HttpGet]
        public IActionResult Get(){
            var res = from actor in _context.Actors 
                        select actor;
                        
            return new OkObjectResult(res);
        }
    }
}