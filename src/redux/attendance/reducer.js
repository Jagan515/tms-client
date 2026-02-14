import { SET_ATTENDANCE_STUDENTS } from "./actions";

export const attendanceReducer = (state = [], action) => {

    switch (action.type) {

        case SET_ATTENDANCE_STUDENTS:
            return action.payload;

        default:
            return state;
    }
};
