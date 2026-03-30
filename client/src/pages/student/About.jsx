import React from "react";
import { motion } from "framer-motion";
import { BookOpen, Users, Video, UploadCloud } from "lucide-react";
import { useNavigate } from "react-router-dom";

// ABOUT SECTION COMPONENT
export default function About() {
    const navigate = useNavigate();
  return (
    <div className="bg-gray-950 text-white min-h-[100vh] px-6 md:px-16 py-16">

      {/* HEADER */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-3xl mx-auto"
      >
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Upskill Yourself. Become Industry Ready.
        </h1>
        <p className="text-gray-400 text-lg">
          Explore hundreds of structured courses designed by top educators.
          Learn step-by-step through chapters and lectures, and build real-world skills.
        </p>
      </motion.div>

      {/* FEATURES */}
      <div className="grid md:grid-cols-3 gap-8 mt-16">

        {/* STUDENTS */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-gray-900 p-6 rounded-2xl shadow-lg"
        >
          <Users className="w-10 h-10 text-blue-500 mb-4" />
          <h3 className="text-xl font-semibold mb-2">For Students</h3>
          <p className="text-gray-400">
            Enroll in courses, follow structured learning paths, and gain practical
            knowledge from experienced instructors.
          </p>
        </motion.div>

        {/* COURSES */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-gray-900 p-6 rounded-2xl shadow-lg"
        >
          <BookOpen className="w-10 h-10 text-green-500 mb-4" />
          <h3 className="text-xl font-semibold mb-2">Structured Courses</h3>
          <p className="text-gray-400">
            Each course is divided into chapters, and each chapter contains multiple
            lectures for step-by-step learning.
          </p>
        </motion.div>

        {/* EDUCATORS */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-gray-900 p-6 rounded-2xl shadow-lg"
        >
          <UploadCloud className="w-10 h-10 text-purple-500 mb-4" />
          <h3 className="text-xl font-semibold mb-2">For Educators</h3>
          <p className="text-gray-400">
            Create, manage, and publish your own courses. Share your expertise
            with learners worldwide.
          </p>
        </motion.div>
      </div>

      {/* COURSE STRUCTURE VISUAL */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mt-20 bg-gray-900 rounded-2xl p-8"
      >
        <h2 className="text-2xl font-semibold mb-6 text-center">
          How Courses Are Structured
        </h2>

        <div className="flex flex-col md:flex-row items-center justify-between gap-6">

          {/* COURSE */}
          <div className="text-center">
            <div className="bg-blue-600 p-4 rounded-full mb-2 inline-block">
              <BookOpen />
            </div>
            <p className="font-medium">Course</p>
          </div>

          <span className="text-gray-500">→</span>

          {/* CHAPTER */}
          <div className="text-center">
            <div className="bg-green-600 p-4 rounded-full mb-2 inline-block">
              <Video />
            </div>
            <p className="font-medium">Chapters</p>
          </div>

          <span className="text-gray-500">→</span>

          {/* LECTURES */}
          <div className="text-center">
            <div className="bg-purple-600 p-4 rounded-full mb-2 inline-block">
              <Video />
            </div>
            <p className="font-medium">Lectures</p>
          </div>
        </div>
      </motion.div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="mt-20 text-center"
      >
        <h2 className="text-3xl font-bold mb-4">Start Your Journey Today</h2>
        <p className="text-gray-400 mb-6">
          Join thousands of learners and educators building skills that matter.
        </p>

        <div className="flex justify-center gap-4">
          <button onClick={()=> navigate('/course-list')}
          className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-xl transition">
            Explore Courses
          </button>
          <button onClick={()=>{navigate('/'); scrollTo(0,0)}}
          className="border border-gray-600 hover:border-white px-6 py-3 rounded-xl transition">
            Home
          </button>
        </div>
      </motion.div>
    </div>
  );
}
