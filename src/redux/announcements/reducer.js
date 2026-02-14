import { SET_ANNOUNCEMENTS } from "./actions";

export const announcementReducer = (state = [], action) => {

    switch (action.type) {

        case SET_ANNOUNCEMENTS:
            return action.payload;

        default:
            return state;
    }
};
