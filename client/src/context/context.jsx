import { createContext, useEffect, useState } from "react";
import humanizeDuration from "humanize-duration";
import { useAuth, useUser } from "@clerk/clerk-react";
import { toast } from "react-toastify";
import axios from "axios";

export const AppContext = createContext();

export const AppContextProvider = (props) => {
    const currency = import.meta.env.VITE_CURRENCY;
    const { VITE_BACKEND_URL } = import.meta.env;

    const { getToken } = useAuth();

    const logToken = async () => {
        console.log(await getToken());
    }

    const { user } = useUser();

    const [allCourses, setAllCourses] = useState([]);
    const [isEducator, setIsEducator] = useState(false);
    const [enrolledCourses, setEnrolledCourses] = useState([]);
    const [userData, setUserData] = useState(null);

    // fetch all courses
    const fetchAllCourses = async () => {
        try {
            const { data } = await axios.get(`${VITE_BACKEND_URL}/api/course/all`);

            if (data.success) {
                setAllCourses(data.allCourses);
            } else {
                toast.error(data.message);
            }
        }
        catch (err) {
            toast.error(err.message);
        }
    }

    // fetch user data
    const fetchUserData = async () => {
        if (user.publicMetadata.role === 'educator') {
            setIsEducator(true);
        }

        try {
            const token = await getToken();
            const { data } = await axios.get(`${VITE_BACKEND_URL}/api/user/data`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (data.success) {
                setUserData(data.user);
            } else {
                toast.error(data.message);
            }
        } catch (err) {
            toast.error(err.message);
        }
    }

    // fetch user enrolled courses
    const fetchUserEnrolledCourses = async () => {
        const token = await getToken();
        try {
            const { data } = await axios.get(`${VITE_BACKEND_URL}/api/user/enrolled-courses`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (data.success) {
                setEnrolledCourses(data.enrolledCourses.reverse());
            } else {
                toast.error(data.message);
            }

        } catch (err) {
            toast.error(err.message);
        }
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
        return Math.floor(totalRating / course.courseRatings.length);
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
    }, [allCourses]);

    useEffect(() => {
        if (user) {
            fetchUserData();
            fetchUserEnrolledCourses();
        }
    }, [user]);

    const value = {
        currency, allCourses, calculateRating,
        isEducator, setIsEducator, calculateChapterTime,
        calculateCourseDuration, calculateNoOfLectures, enrolledCourses, fetchUserEnrolledCourses, VITE_BACKEND_URL, userData, setUserData,
        getToken, fetchAllCourses
    }

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}