import React, { createContext, useContext, useEffect, useReducer } from "react";

interface UserState {
    user: User | null;
}

interface User {
    name: string;
    surname: string;
    email: string;
    password: string;
    profileImage: string;
}

const initialState: UserState = {
    user: null,
}

type UserAction =
  | { type: 'SET_USER'; payload: User }
  | { type: 'CLEAR_USER' };

const UserContext = createContext<{
    state: UserState;
    dispatch: React.Dispatch<UserAction>
}>({
    state: initialState,
    dispatch: () => undefined
})

const userReducer = (state: UserState, action: UserAction): UserState => {
    switch (action.type){
        case 'SET_USER':
            return { ...state, user: action.payload };
        case 'CLEAR_USER':
            return { ...state, user: null };
        default:
            return state;    
    }
};

export const UserProvider = ({children} : {children :any}) => {
    const [state, dispatch] = useReducer(userReducer, initialState);

    return (
        <UserContext.Provider value={{state, dispatch}}>
            {children}
        </UserContext.Provider>
    )
}

export const useUser = () => {
    return useContext(UserContext);
}