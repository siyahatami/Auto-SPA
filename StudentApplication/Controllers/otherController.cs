using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace StudentApplication.Controllers
{
    public class otherController : Controller
    {
        // GET: other
        public ActionResult page2()
        {
            return View();
        }
        public ActionResult page3()
        {
            return View();
        }

        public String pageA()
        {
            return "this is pageA <br/> this is pageA <br/> this is pageA <br/> this is pageA <br/> this is pageA <br/> this is pageA <br/> this is pageA <br/> ";
        }

        public String pageB()
        {
            return "this is pageB <br/> this is pageB <br/> this is pageB <br/> this is pageB <br/>";
        }

        public String pageC()
        {
            return "this is pageC <br/> pageC <br/> pageC <br/> pageC <br/> pageC <br/> pageC <br/>pageC <br/>pageC <br/>pageC <br/>pageC <br/>pageC <br/>pageC <br/>pageC <br/>pageC <br/>";
        }
    }
}