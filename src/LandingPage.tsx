import { useAuth0 } from "@auth0/auth0-react";
import React from "react";
import { Button, Col, Image, Row } from "react-bootstrap";

export function LandingPage() {
    const {loginWithRedirect} = useAuth0();    
    return (
        <React.Fragment>
            <h1>Welcome to Enough Calculator!</h1>
            <Row>
                <Col xs={12} md={7}>
                    <Image src="/kristel-hayes--BcnpZHZJx4-unsplash.jpg" rounded fluid />
                </Col>
                <Col xs={12} md={5} className="d-flex">
                    <div className="my-auto">
                        <div className="text-center">
                            Here comes some awesome marketing content that makes click the below button.
                            We can help you get confident with your finances. Connect your bank and brokerage accounts and see your total net worth before you can say gazillion.
                        </div>
                        <p className="d-flex mt-3">
                            <Button className="mx-auto" onClick={()=>{loginWithRedirect({                                
                                screen_hint: "signup"
                            })}}>Sign Up</Button>
                        </p>
                    </div>
                </Col>
            </Row>
        </React.Fragment>
    )
}