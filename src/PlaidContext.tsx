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
/*
const plaidContextProvider = {
    _hasAccessToken: false,
    hasLinkToken: false,
    isLoadingLinkToken: false, 
    isLoadingAccessToken: false, 
    linkToken: "",
    startedLoadingLinkToken(){
        plaidContextProvider.isLoadingLinkToken=true;
        plaidContextProvider.hasLinkToken = false;
        plaidContextProvider.linkToken ="";
    },
     
    setLinkToken(token:string){
        plaidContextProvider.linkToken=token; 
        plaidContextProvider.isLoadingLinkToken=false;       
        plaidContextProvider.hasLinkToken=true;        
    },

    startedLoadingAccessToken(){
        plaidContextProvider.isLoadingAccessToken = true;
        plaidContextProvider._hasAccessToken = false;
    },  

    loadedAccessToken(){
        plaidContextProvider._hasAccessToken =true;
        plaidContextProvider.isLoadingAccessToken = false;
    },

    hasAccessToken(){
        return false;
    }
}
*/
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
/*
function usePlaidProvider() {     
    const {client, isReady} = useFPClient();


    function hasAccessToken(){
        console.log("Has access token invoked.");
        if (plaidContextProvider._hasAccessToken) {console.log("returning true");return true ;}
        else {
            if (isReady){
                client.hasPlaidAccessToken().then((hasToken) => 
                {
                    plaidContextProvider._hasAccessToken = hasToken                    
                })
            }
            console.log ("Client ready: " + isReady + " and hasAccessToken: " + plaidContextProvider._hasAccessToken);
            return plaidContextProvider._hasAccessToken;
        }        
    }    
    
    plaidContextProvider.hasAccessToken = hasAccessToken;
    return plaidContextProvider;
}*/

export function usePlaidContext() {
    return useContext(PLAID_CONTEXT);
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
    /*
        const [hasLinkToken, setHasLinkToken] = useState(false);
        const [hasAccessToken, setHasAccessToken] = useState(false);
        const [isLoadingLinkToken, setIsLoadingLinkToken] = useState(false);
        const [isLoadingAccessToken, setIsLoadingAccessToken] = useState(false);
        const [linkToken, setLinkToken] = useState("");*/



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
        /*
                setIsLoadingLinkToken(true);
                setHasLinkToken(false);
                setLinkToken("");*/
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
        /*       setLinkToken(token);
               setHasLinkToken(true);
               setIsLoadingLinkToken(false);*/
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
        /*   setIsLoadingAccessToken(true);
           setHasAccessToken(false);*/
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
        /*    setHasAccessToken(true);
            setIsLoadingAccessToken(false);*/
    }

    function checkAccessToken() {
        console.log("Has access token invoked.");
        if (hasAccessToken) { console.log("returning true"); return true; }
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
            console.log("Client ready: " + isReady + " and hasAccessToken: " + hasAccessToken);
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