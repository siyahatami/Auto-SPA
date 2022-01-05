using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using StudentApplication.Models;

using TantaneLib;

namespace StudentApplication.Controllers
{
    public class StudentController : Controller
    {
        
        public ActionResult Index()
        {
            if (_DB.Students==null)
                _DB.Students = new List<Student>();
            return View(_DB.Students);
        }


        public ActionResult Details(int id)
        {
            ViewBag.studentID = id;
            return View();
        }

        public ActionResult Details1(int id)
        {
            ViewBag.studentID = id;
            return View();
        }
        public ActionResult Details2(int id)
        {
            ViewBag.studentID = id;
            return View();
        }

        public ActionResult Courses(int studentID)
        {
            ViewBag.studentID = studentID;
            //return "studentId="+ studentID;
            return View(_DB.Students.FirstOrDefault(i => i.ID == studentID).Courses);
        }


        
        public ActionResult Create()
        {
            return View(new Student());
        }

        // POST: Home/Create
        [HttpPost]
        public ActionResult Create(Student student)
        {
            student.ID = _DB.IdCounter++;
            student.Courses=new List<Course>();
            _DB.Students.Add(student);
            return Redirect("~/student/Index?"+
                TanFieldsName.TanLayoutCloseState+"="+TanLayoutCloseState.CloseAndRefereshDependentBlocks);
            
        }

        public ActionResult Edit(int id)
        {
            return View(_DB.Students.FirstOrDefault(i=>i.ID==id));
        }

        // POST: Home/Edit/5
        [HttpPost]
        public ActionResult Edit(int id, Student student)
        {
            Student st =_DB.Students.FirstOrDefault(s => s.ID == id);
            st.Name = student.Name;
            st.Family = student.Family;
            return RedirectToAction("Index");
            
        }

        public ActionResult Delete(int id)
        {

            return View(_DB.Students.FirstOrDefault(i => i.ID == id));
        }

        // POST: Home/Delete/5
        [HttpPost]
        public ActionResult Delete(int id, Student student)
        {
            Student st = _DB.Students.FirstOrDefault(s => s.ID == id);
            _DB.Students.Remove(st);
            return RedirectToAction("Index");
        }
    }
}
