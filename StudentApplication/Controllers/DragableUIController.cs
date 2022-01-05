using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace StudentApplication.Controllers
{
    public class DragableUIController : Controller
    {
        // GET: DragableUI
        public ActionResult Index()
        {
            return View();
        }



        public ActionResult window(int id=0)
        {

            ViewBag.id = id;
            
            return View();
        }



    }
}