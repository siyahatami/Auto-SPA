using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using StudentApplication.Models;

using TantaneLib;

namespace StudentApplication.Controllers
{
    public class CourseController : Controller
    {
        public ActionResult Details(int studentID, int courseID)
        {
            
            return View(_DB.Students.FirstOrDefault(s=>s.ID==studentID).Courses.FirstOrDefault(c=>c.ID==courseID));
        }

        // GET: Course/Create
        public ActionResult Create(int studentID)
        {
            return View(new Course() {StudentID = studentID });
        }

        public string totalCourseCount()
        {
            if (_DB.Students == null || _DB.Students.Count == 0)
                return "0";

            return "total course's counts: " + (from st in _DB.Students
                                                select st.Courses.Count).Sum().ToString();
        }

        [HttpPost]
        public ActionResult Create(Course course)
        {
            if (_DB.Students.FirstOrDefault(s => s.ID == course.StudentID).Courses == null)
                _DB.Students.FirstOrDefault(s => s.ID == course.StudentID).Courses = new List<Course>();


            course.ID = _DB.IdCounter++;
            _DB.Students.FirstOrDefault(s => s.ID == course.StudentID).Courses.Add(course);

            return Redirect("/student/Courses/?studentID=" + course.StudentID);
        }

        // GET: Course/Edit/5
        public ActionResult Edit(int studentID, int courseID)
        {
            return View(_DB.Students.FirstOrDefault(s => s.ID == studentID).Courses.FirstOrDefault(c=>c.ID==courseID));
        }

        // POST: Course/Edit/5
        [HttpPost]
        public ActionResult Edit(Course course)
        {
            Course cou= _DB.Students.FirstOrDefault(s => s.ID == course.StudentID).Courses.FirstOrDefault(c => c.ID == course.ID);
            cou.Details = course.Details;
            cou.Title = course.Title;
            cou.Unit = course.Unit;

            return Redirect("/course/minidetails/?studentID=" + course.StudentID+ "&courseID="+course.ID);
        }

        [HttpGet]
        public ActionResult Delete(int studentID, int courseID)
        {
            return View(_DB.Students.FirstOrDefault(s => s.ID == studentID).Courses.FirstOrDefault(c => c.ID == courseID));
        }

        [HttpPost]
        public ActionResult Delete(int studentID, int courseID,Course course)
        {
            Student stu = _DB.Students.FirstOrDefault(s => s.ID == studentID);
            Course cou = stu.Courses.FirstOrDefault(c => c.ID == courseID);
            stu.Courses.Remove(cou);

            return Redirect("~/student/Courses/?studentID=" + studentID +"&"+
                TanFieldsName.TanLayoutCloseState + "=" + TanLayoutCloseState.CloseAndRefereshDependentBlocks);
        }

        [HttpGet]
        public ActionResult MiniDetails(int studentID, int courseID)
        {
            return View(_DB.Students.FirstOrDefault(s => s.ID == studentID).Courses.FirstOrDefault(c => c.ID == courseID));
        }

    }
}
