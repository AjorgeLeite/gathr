import { LOGIN_SUCCESS, LOGIN_FAILURE, LOGOUT } from '../action-creators/actions';

const initialState = {
  user: {
    isLoggedIn: false,
    name: '',
    userId: null, 
  },
  error: '',
};

const userReducer = (state = initialState, action: { type: any; payload: { name: string; errorMessage: any; events: any; userId: number }; }) => {
  switch (action.type) {
    case LOGIN_SUCCESS:
      console.log("reducer login success name: " + action.payload.name)
      return {
        
        ...state,
        user: {
          ...state.user,
          isLoggedIn: true,
          name: action.payload.name,
          userId: action.payload.userId,
        },
        error: '',
      };
    case LOGIN_FAILURE:
      return {
        ...state,
        user: {
          ...state.user,
          isLoggedIn: false,
          name: '',
        },
        error: action.payload.errorMessage,
      };
      case LOGOUT:
      return {
        ...state,
        user: {
          isLoggedIn: false,
          name: '',
          userId: null,
        },
        error: '',
      };
    default:
      return state;
  }
};

export default userReducer;