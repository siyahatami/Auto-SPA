using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Helpers;
using System.Web.Mvc;
using System.Web.Routing;
using StudentApplication;
using TantaneLib;

[assembly: PreApplicationStartMethod(typeof(MvcApplication), "TanRegister")]
namespace StudentApplication
{
    public class MvcApplication : System.Web.HttpApplication
    {
        protected void Application_Start()
        {
            AreaRegistration.RegisterAllAreas();
            RouteConfig.RegisterRoutes(RouteTable.Routes);
        }

        public static void TanRegister()
        {
            HttpApplication.RegisterModule(typeof(TanHttpModule));
            AntiForgeryConfig.SuppressXFrameOptionsHeader = true; // Remove this line if you sure that you will set property "EndResponse: true" for all redirect commmands like, Response.Redirect, Return.Redirect and ...

        }
    }
}
