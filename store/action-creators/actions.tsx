export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_FAILURE = 'LOGIN_FAILURE';
export const LOGOUT = 'LOGOUT';


export const loginSuccess = (name: string, userId: number) => ({
  type: LOGIN_SUCCESS,
  payload: {
    name,
    userId,
    errorMessage: null, 
    events: null,
  },
});

export const loginFailure = (errorMessage: any) => ({
  type: LOGIN_FAILURE,
  payload: { errorMessage },
});

export const logout = () => ({ 
  type: LOGOUT,
});
