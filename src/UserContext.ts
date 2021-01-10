import { createContext } from "react";

export interface User {
    userId: string,
    displayName: string
}

export interface UserContext {
    user?: User,
    logIn(user: User): void,
    logOut(): void
}

export const USER_CONTEXT = createContext<UserContext>({
    user: undefined,
    logIn: (user)=>{},
    logOut: () => {}
})