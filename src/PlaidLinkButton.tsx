import React, { useCallback } from "react";
import { Button } from "react-bootstrap";
import { usePlaidLink } from "react-plaid-link";
import { fpClient } from "./FPClient";

//Usage: 
//{linkToken !== undefined ? <PlaidLinkButton linkToken={linkToken} /> : "Loading..."}

export function PlaidLinkButton(props: { linkToken: string, callback?:()=>void }) {  
    const {linkToken, callback}  = props;
    
    const onSuccess = useCallback((token, metadata) => {
        fpClient.setPublicToken(token);
        if (callback !== undefined) callback();
    }, [callback]);

    console.log("Token: " + props.linkToken);

    const config = {
        token: linkToken,
        onSuccess: onSuccess
    };

    const { open, ready } = usePlaidLink(config);
    return <Button onClick={() => open()} disabled={!ready} variant="primary">Connect my account</Button>
}


