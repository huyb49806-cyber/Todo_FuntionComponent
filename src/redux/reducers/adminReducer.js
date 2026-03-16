import * as types from '../constants'

const initialState = {
    listUsers: []
};

export const adminReducer = (state = initialState, action) => {
    switch (action.type) {
        case types.GET_USER_SUCCESS:
            return {
                ...state,
                listUsers: action.payload
            }
        case types.DELETE_USER_SUCCESS:
            return {
                ...state,
                listUsers: state.listUsers.filter(user => user.id !== action.payload)
            };
        default:
            return state;
    }
}
