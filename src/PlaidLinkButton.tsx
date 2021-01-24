import React, { useCallback, useEffect } from "react";
import { Button } from "react-bootstrap";
import { usePlaidLink } from "react-plaid-link";
import { useFPClient } from "./FPClient";
import { usePlaidContext } from "./PlaidContext";

function PlaidLinkButtonUnsafe(props: { callback?: () => void, linkToken: string }) {

    const {linkToken, callback} = props;
    const {
        isLoadingAccessToken,
        loadedAccessToken,
        startedLoadingAccessToken,
    } = usePlaidContext();

    const {client, isReady} = useFPClient();

    //TODO: make sure token storage is retried if client was not yet ready
    const onSuccess = useCallback((token) => {
        console.log("Plaid onSuccess invoked");
        console.log("isReady: " + isReady);
        console.log("isLoading Access token: " + isLoadingAccessToken);
        if (isReady && !isLoadingAccessToken) {
            startedLoadingAccessToken();
            client.setPublicToken(token).then(() => {
                console.log("Public Token set, callback is null: " + (callback === undefined).toString());
                loadedAccessToken();
                if (callback !== undefined) callback();
            })
        }
    }, [isReady, isLoadingAccessToken, callback, client, startedLoadingAccessToken, loadedAccessToken]);


    const config = {
        token: linkToken,
        onSuccess: onSuccess
    };

    const { open, ready } = usePlaidLink(config);
    return (
        <Button onClick={() => { open() }} disabled={!ready} variant="primary">
            {(ready) ? "Connect my account" : "Loading..."}
        </Button>)
}

export function PlaidLinkButton(props: { callback?: () => void }) {    

    const { callback } = props;
    const { client, isReady } = useFPClient();
    const {
        hasLinkToken,
        isLoadingLinkToken,  
        linkToken,     
        loadedLinkToken,
        startedLoadingLinkToken
    } = usePlaidContext();

    console.log("Rendering Plaid Link Button, hasLinkToken: " + hasLinkToken + " is Loading link token: " + isLoadingLinkToken);

    useEffect(() => {
        if (isReady && !hasLinkToken && !isLoadingLinkToken) {
            startedLoadingLinkToken();
            console.log("Fetching link token");
            client.getLinkToken()
                .then((token) => {
                    console.log("got Link token:  " + token);
                    loadedLinkToken(token);                    
                });
        }
    }, [isReady, hasLinkToken, isLoadingLinkToken, client, loadedLinkToken, startedLoadingLinkToken]);



    if(hasLinkToken){
        return <PlaidLinkButtonUnsafe callback={callback} linkToken = {linkToken}/>                
    } else {
        return <Button disabled>Loading...</Button>;
    }

}