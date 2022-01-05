using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography.X509Certificates;
using System.Web;

namespace StudentApplication.Models
{

    public class Student
    {
        public int ID { get; set; }
        public string Name { get; set; }
        public string Family { get; set; }

        public virtual List<Course> Courses { get; set; }
    }

    public class Course
    {
        public int ID { get; set; }
        public string Title { get; set; }
        public int Unit { get; set; }
        public int StudentID { get; set; }
        public string Details { get; set; }

    }


    public static class _DB
    {
        public static int IdCounter;
        public static List<Student> Students { get; set; }

    }

}