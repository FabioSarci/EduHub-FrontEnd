import { createContext, ReactNode, useContext, useReducer, useState } from "react";
import axios from "axios";

export interface ICourse {
    id: number;
    courseId : string
    userId: string;
}

interface ICourseContextState {
    courses: ICourse[];
    userCourses: ICourse[];
}

interface ICourseContextProps extends ICourseContextState {
    dispatch: React.Dispatch<CourseAction>;
    handleCourseCreate: (courseData: Omit<ICourse, "id">) => void;
    handleCourseEdit: (courseUpdData: Partial<ICourse>) => void;
    handleCourseDelete: (id: ICourse["id"]) => void;
    fetchUserCourses: (userId: number) => void;
    getCourses: (token: string, id: number) => void;
    usercourses: ICourse[] | undefined;
}

type CourseAction =
    | {
          type: "SET_COURSES";
          payload: {
              courses: ICourse[];
          };
      }
    | {
          type: "SET_USER_COURSES";
          payload: {
              userCourses: ICourse[];
          };
      }
    | {
          type: "ADD_COURSE";
          payload: {
              course: ICourse;
          };
      }
    | {
          type: "UPDATE_COURSE";
          payload: {
              course: Partial<ICourse>;
          };
      }
    | {
          type: "DELETE_COURSE";
          payload: {
              courseId: ICourse["id"];
          };
      };

export const CourseContext = createContext<ICourseContextProps | null>(null);

const CourseReducer = (state: ICourseContextState, action: CourseAction): ICourseContextState => {
    switch (action.type) {
        case "SET_COURSES":
            return {
                ...state,
                courses: action.payload.courses,
            };
        case "SET_USER_COURSES":
            return {
                ...state,
                userCourses: action.payload.userCourses,
            };
        case "ADD_COURSE":
            return {
                ...state,
                courses: [...state.courses, action.payload.course],
            };
        case "UPDATE_COURSE":
            return {
                ...state,
                courses: state.courses.map((course) => {
                    if (course.id === action.payload.course.id) {
                        return {
                            ...course,
                            ...action.payload.course,
                        };
                    }
                    return course;
                }),
            };
        case "DELETE_COURSE":
            return {
                ...state,
                courses: state.courses.filter((course) => course.id !== action.payload.courseId),
            };
        default:
            return state;
    }
};

const initialState: ICourseContextState = {
    courses: [],
    userCourses: [],
};

export const CourseProvider = ({ children }: { children: ReactNode }) => {
    const [state, dispatch] = useReducer(CourseReducer, initialState);
    const [usercourses, setUserCourses] = useState<ICourse[]>()

    function handleCourseCreate(courseData: Omit<ICourse, "id">) {
        axios
            .post("https://jsonplaceholder.typicode.com/posts", courseData) // Replace with your API endpoint
            .then(({ data }) => {
                dispatch({
                    type: "ADD_COURSE",
                    payload: {
                        course: { id: data.id, ...courseData },
                    },
                });
            })
            .catch((err) => {
                console.error(err);
            });
    }

    function handleCourseEdit(courseUpdData: Partial<ICourse>) {
        axios
            .put(`https://jsonplaceholder.typicode.com/posts/${courseUpdData.id}`, courseUpdData) // Replace with your API endpoint
            .then(() => {
                dispatch({
                    type: "UPDATE_COURSE",
                    payload: {
                        course: courseUpdData,
                    },
                });
            })
            .catch((err) => {
                console.error(err);
            });
    }

    function handleCourseDelete(id: ICourse["id"]) {
        axios
            .delete(`https://jsonplaceholder.typicode.com/posts/${id}`) // Replace with your API endpoint
            .then(() => {
                dispatch({
                    type: "DELETE_COURSE",
                    payload: {
                        courseId: id,
                    },
                });
            })
            .catch((err) => {
                console.error(err);
            });
    }

    function fetchUserCourses(userId: number) {
        axios
            .get(`https://your-api-endpoint.com/users/${userId}/courses`) // Replace with your API endpoint
            .then(({ data }) => {
                dispatch({
                    type: "SET_USER_COURSES",
                    payload: {
                        userCourses: data,
                    },
                });
            })
            .catch((err) => {
                console.error(err);
            });
    }
    const getCourses = (token: string, id: number) =>{
        axios
                        .get(`http://localhost:7001/usercourses-by-userid/${id}`,{
                            headers: {
                                Authorization: `Bearer ${token}`,
                            },
                        }
                        )
                        .then(({ data }) => {
                            setUserCourses(data.map((item: any) => ({
                                id: item.id,
                                courseId: item.courseId,
                                userId: item.userId,
                                }))
                            );
                            
                        })
                        .catch((err) => {
                            console.error(err);
                        });
    }

    return (
        <CourseContext.Provider value={{ ...state, usercourses, dispatch, handleCourseCreate, handleCourseEdit, handleCourseDelete, fetchUserCourses ,getCourses}}>
            {children}
        </CourseContext.Provider>
    );
};



export const useCourseContext = () => {
    const context = useContext(CourseContext);
    if (!context) {
        throw new Error("useCourseContext must be used inside CourseProvider");
    }
    return context;
};
