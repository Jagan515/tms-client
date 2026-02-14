import { SET_FEES } from "./actions";

export const feeReducer = (state = [], action) => {

    switch (action.type) {

        case SET_FEES:
            return action.payload;

        default:
            return state;
    }
};
