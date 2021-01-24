import { createContext, useContext, useState } from "react";
import { useFPClient } from "./FPClient";

export interface PlaidContext {
    hasLinkToken: boolean,
    hasAccessToken: boolean,
    isLoadingLinkToken: boolean,
    isLoadingAccessToken: boolean,
    linkToken: string,
    checkedAccessToken: boolean,

    startedLoadingLinkToken(): void
    loadedLinkToken(token: string): void

    startedLoadingAccessToken(): void
    loadedAccessToken(): void

    checkAccessToken(): boolean

}

export const PLAID_CONTEXT = createContext<PlaidContext>({
    hasLinkToken: false,
    hasAccessToken: false,
    isLoadingLinkToken: false,
    isLoadingAccessToken: false,
    linkToken: "",
    checkedAccessToken: false,

    startedLoadingLinkToken(): void { },
    loadedLinkToken(token: string): void { },

    startedLoadingAccessToken(): void { },
    loadedAccessToken(): void { },

    checkAccessToken(): boolean { return false }
});

export function usePlaidContext() {
    const plaidContext = useContext(PLAID_CONTEXT);
    return plaidContext;
}

export function PlaidContextProvider({ children }) {
    const { client, isReady } = useFPClient();

    const [state, setState] = useState({
        hasLinkToken: false,
        hasAccessToken: false,
        isLoadingLinkToken: false,
        isLoadingAccessToken: false,
        linkToken: "",
        checkedAccessToken: false
    });



    const {
        hasLinkToken,
        hasAccessToken,
        isLoadingLinkToken,
        isLoadingAccessToken,
        linkToken,
        checkedAccessToken
    } = state;

    console.log("Rendering PlaidContextProvider, hasLinkToken: " + hasLinkToken);

    function startedLoadingLinkToken() {
        setState({
            hasLinkToken: false,
            hasAccessToken: hasAccessToken,
            isLoadingLinkToken: true,
            isLoadingAccessToken: isLoadingAccessToken,
            linkToken: "",
            checkedAccessToken: checkedAccessToken
        })

        console.log("Started loading link token");
    }

    function loadedLinkToken(token: string) {
        setState({
            hasLinkToken: true,
            hasAccessToken: hasAccessToken,
            isLoadingLinkToken: false,
            isLoadingAccessToken: isLoadingAccessToken,
            linkToken: token,
            checkedAccessToken: checkedAccessToken
        })

        console.log("Loaded link token. hasLinkToken: " + hasLinkToken + " isLoading: " + isLoadingLinkToken);
    }

    function startedLoadingAccessToken() {
        setState({
            hasLinkToken: hasLinkToken,
            hasAccessToken: false,
            isLoadingLinkToken: isLoadingLinkToken,
            isLoadingAccessToken: true,
            linkToken: linkToken,
            checkedAccessToken: checkedAccessToken
        })

    }

    function loadedAccessToken() {
        setState({
            hasLinkToken: hasLinkToken,
            hasAccessToken: true,
            isLoadingLinkToken: isLoadingLinkToken,
            isLoadingAccessToken: false,
            linkToken: linkToken,
            checkedAccessToken: checkedAccessToken
        })
    }

    function checkAccessToken() {
        if (hasAccessToken) { return true; }
        //Only check for access token once
        else if (checkedAccessToken && !isLoadingAccessToken) return false;
        else {
            if (isReady && !isLoadingAccessToken) {
                setState({
                    hasLinkToken: hasLinkToken,
                    hasAccessToken: hasAccessToken,
                    isLoadingLinkToken: isLoadingLinkToken,
                    isLoadingAccessToken: true,
                    linkToken: linkToken,
                    checkedAccessToken: false
                })
                client.hasPlaidAccessToken().then((hasToken) => {
                    setState({
                        hasLinkToken: hasLinkToken,
                        hasAccessToken: hasToken,
                        isLoadingLinkToken: isLoadingLinkToken,
                        isLoadingAccessToken: false,
                        linkToken: linkToken,
                        checkedAccessToken: true
                    })
                })
            }
            console.log("Client ready: " + isReady + " and hasAccessToken: " 
                + hasAccessToken + " checked already: " + checkedAccessToken + " loading: " + isLoadingAccessToken);
            return hasAccessToken;
        }
    }

    let plaidContext = {
        hasLinkToken: hasLinkToken,
        hasAccessToken: hasAccessToken,
        isLoadingAccessToken: isLoadingAccessToken,
        isLoadingLinkToken: isLoadingLinkToken,
        linkToken: linkToken,
        checkedAccessToken: checkedAccessToken,
        startedLoadingLinkToken: startedLoadingLinkToken,
        startedLoadingAccessToken: startedLoadingAccessToken,
        loadedLinkToken: loadedLinkToken,
        loadedAccessToken: loadedAccessToken,
        checkAccessToken: checkAccessToken
    }


    return <PLAID_CONTEXT.Provider value={plaidContext}>
        {children}
    </PLAID_CONTEXT.Provider>
}