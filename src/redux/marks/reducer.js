import { SET_MARKS } from "./actions";

export const marksReducer = (state = [], action) => {

    switch (action.type) {

        case SET_MARKS:
            return action.payload;

        default:
            return state;
    }
};
