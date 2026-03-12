import { createContext, useEffect, useState } from "react";
import { dummyCourses } from "../assets/assets";
import humanizeDuration from "humanize-duration";
import {useAuth, useUser} from "@clerk/clerk-react"

export const AppContext = createContext();

export const AppContextProvider = (props) => {
    const currency = import.meta.env.VITE_CURRENCY;

    const {getToken} = useAuth();
    const {user} = useUser();

    const [allCourses, setAllCourses] = useState([]);
    const [isEducator, setIsEducator] = useState(true);
    const [enrolledCourses, setEnrolledCourses] = useState([]);

    // fetch all courses
    const fetchAllCourses = async () => {
        setAllCourses(dummyCourses);
    }
    // fetch user enrolled courses
    const fetchUserEnrolledCourses = async() => {
        setEnrolledCourses(dummyCourses);
    }

    // Function to calculate avg rating of course
    const calculateRating = (course) => {
        if (course.courseRatings.length === 0) {
            return 0;
        }
        let totalRating = 0;
        course.courseRatings.forEach((rating) => {
            totalRating += rating.rating;
        })
        return totalRating / course.courseRatings.length;
    }

    // function to calculate chapter time.
    const calculateChapterTime = (chapter) => {
        let time = 0;
        chapter.chapterContent.map((lecture) => {
            time += lecture.lectureDuration;
        });
        // time stored as minute number, so converting to mili-sec and then humanize.
        return humanizeDuration(time * 60 * 1000, { units: ['h', 'm'] });
    }

    // function to calculate course duration of a course.
    const calculateCourseDuration = (course) => {
        let time = 0;
        course.courseContent.map((chapter) => {
            chapter.chapterContent.map((lecture) => {
                time += lecture.lectureDuration;
            })
        });
        return humanizeDuration(time * 60 * 1000, { units: ['h', 'm'] });
    }

    // function to calculate the total lectures of a course.
    const calculateNoOfLectures = (course) => {
        let totalLectures = 0;
        course.courseContent.forEach((chapter) => {
            if (Array.isArray(chapter.chapterContent))
                totalLectures += chapter.chapterContent.length;
        });
        return totalLectures;
    }

    useEffect(() => {
        fetchAllCourses();
        fetchUserEnrolledCourses();
    }, []);

    const logToken = async() => {
        console.log(await getToken());
    }

    useEffect(() => {
        if(user){
            logToken();
        }
    }, [user]);

    const value = {
        currency, allCourses, calculateRating,
        isEducator, setIsEducator, calculateChapterTime,
        calculateCourseDuration, calculateNoOfLectures,enrolledCourses, fetchUserEnrolledCourses
    }

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}