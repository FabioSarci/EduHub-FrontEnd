import { createContext, ReactNode, useContext, useReducer, useState } from "react";
import axios from "axios";
import { ICourseProps } from "@/interfaces/Course";

export interface IUserCourse {
    id: number;
    courseId : string
    userId: string;
}

interface ICourseContextState {
    courses: ICourseProps[];
    userCourses: IUserCourse[];
}

interface ICourseContextProps extends ICourseContextState {
    dispatch: React.Dispatch<CourseAction>;
    handleCourseCreate: (courseData: Omit<ICourseProps, "id">) => void;
    handleCourseEdit: (courseUpdData: Partial<ICourseProps>) => void;
    handleCourseDelete: (id: ICourseProps["id"]) => void;
    getUserCourses: (token: string, id: number) => void;
    usercourses: IUserCourse[] | undefined;
}

type CourseAction =
    | {
          type: "SET_COURSES";
          payload: {
              courses: ICourseProps[];
          };
      }
    | {
          type: "SET_USER_COURSES";
          payload: {
              userCourses: IUserCourse[];
          };
      }
    | {
          type: "ADD_COURSE";
          payload: {
              course: ICourseProps;
          };
      }
    | {
          type: "UPDATE_COURSE";
          payload: {
              course: Partial<ICourseProps>;
          };
      }
    | {
          type: "DELETE_COURSE";
          payload: {
              courseId: ICourseProps["id"];
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
    const [usercourses, setUserCourses] = useState<IUserCourse[]>();

    function handleCourseCreate(courseData: Omit<ICourseProps, "id">) {
        axios
            .post("http://localhost:7001/course/create", courseData)
            .then(({ data }) => {
                dispatch({
                    type: "ADD_COURSE",
                    payload: {
                        course: { id: data.id, ...courseData } as ICourseProps,
                    },
                });
            })
            .catch((err) => {
                console.error(err);
            });
    }

    function handleCourseEdit(courseUpdData: Partial<ICourseProps>) {
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

    function handleCourseDelete(id: ICourseProps["id"]) {
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
    const getUserCourses = (token: string, userId: number) =>{
        axios
                        .get(`http://localhost:7001/usercourses-by-userid/${userId}`,{
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
        <CourseContext.Provider value={{ ...state, usercourses, dispatch, handleCourseCreate, handleCourseEdit, handleCourseDelete ,getUserCourses}}>
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
