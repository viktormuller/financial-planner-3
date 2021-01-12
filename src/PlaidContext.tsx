import { createContext, useEffect, useState } from "react";
import { fpClient } from "./FPClient";

export interface PlaidContext {
    connected: boolean,
    connect(cb): void,
    disconnect(cb): void
}

const plaidContextProvider = {
    connected: false,
    connect(cb) {
        plaidContextProvider.connected = true;
        cb();
    },
    disconnect(cb) {
        plaidContextProvider.connected = false;
        cb();
    }
}

export const PLAID_CONTEXT = createContext<PlaidContext>(plaidContextProvider);

//Add is Loading indicator
export function usePlaidProvider() {
    let [plaidConnected, setPlaidConnected] = useState(false);

    function connect(cb) {
        setPlaidConnected(true);
        plaidContextProvider.connect(cb);
    }

    function disconnect(cb) {
        setPlaidConnected(false);
        plaidContextProvider.disconnect(cb);
    }

    return {
        connected: plaidConnected,
        connect: connect,
        disconnect: disconnect
    }
}

//Add is Loading indicator
export function useGetLinkToken() {
    const [linkToken, setLinkToken] = useState<string>();
    useEffect(() => {
        async function getLinkToken() {
            if (!linkToken) {
                let token = await fpClient.getLinkToken();
                setLinkToken(token);
            }
        }
        getLinkToken();        
    },[linkToken])
    return linkToken;
}