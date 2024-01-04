import { LOGIN_SUCCESS, LOGIN_FAILURE, LOGOUT } from '../action-creators/actions';

interface UserState {
  isLoggedIn: boolean;
  name: string;
  userId: number | null;
}

interface RootState {
  user: UserState;
  error: string;
}

const initialState: RootState = {
  user: {
    isLoggedIn: false,
    name: '',
    userId: null,
  },
  error: '',
};

const userReducer = (state = initialState, action: any): RootState => {
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
