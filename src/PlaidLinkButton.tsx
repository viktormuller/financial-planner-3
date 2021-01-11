import React, { useCallback } from "react";
import { Button } from "react-bootstrap";
import { usePlaidLink } from "react-plaid-link";
import { fpClient } from "./FPClient";

//Usage: 
//{linkToken !== undefined ? <PlaidLinkButton linkToken={linkToken} /> : "Loading..."}

export function PlaidLinkButton(props: { linkToken: string }) {
    const onSuccess = useCallback((token, metadata) => {
        fpClient.setPublicToken(token);
        window.location.href = "/networth";
    }, []);

    console.log("Token: " + props.linkToken);

    const config = {
        token: props.linkToken,
        onSuccess: onSuccess
    };

    const { open, ready } = usePlaidLink(config);
    return <Button onClick={() => open()} disabled={!ready} variant="primary">Let's get started</Button>
}


