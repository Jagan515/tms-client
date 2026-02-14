import { SET_STUDENTS, ADD_STUDENT, REMOVE_STUDENT } from "./actions";

export const studentReducer = (state = [], action) => {

    switch (action.type) {

        case SET_STUDENTS:
            return action.payload;

        case ADD_STUDENT:
            return [...state, action.payload];

        case REMOVE_STUDENT:
            return state.filter(
                (student) => student._id !== action.payload
            );

        default:
            return state;
    }
};
