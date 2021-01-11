import { createContext } from "react";

export interface User {
    userId: string,
    displayName: string
}

export interface UserContext {
    user?: User,
    logIn(user: User, cb): void,
    logOut(cb): void
}

export const fakeAuth = {
    user: undefined,
    logIn(user,cb){
        fakeAuth.user=user;
        setTimeout(cb,100);
    },
    logOut(cb){
        fakeAuth.user = undefined;
        setTimeout(cb,100);
    }

}

export const USER_CONTEXT = createContext<UserContext>(fakeAuth);