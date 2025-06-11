using Microsoft.AspNetCore.Mvc;

namespace TicketsDeiman.Pages
{
    public class HomeController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
