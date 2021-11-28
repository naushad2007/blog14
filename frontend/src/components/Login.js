import React from "react";
import axios from "axios";
import dotenv from "dotenv";

import GoogleLogin from "react-google-login";


dotenv.config();
const baseURL = process.env.REACT_APP_BASEURL || "https://blog2007.herokuapp.com";

class Login extends React.Component {
    //After logging in, redirect to previous page
    componentDidMount() {
        if (sessionStorage.getItem("isLoggedIn") === "true") {
            window.history.back();
        }
    }

    // Google login success callback
    successGoogleLogin(response) {
        // Create an instance of the user
        const user = {
            username: response.profileObj.name,
            socialId: response.googleId,
        };

        // Make an API call to either findOrCreate the user
        axios
            .post(`${baseURL}/auth/login`, user)
            .then((res) => {
                // Reload the page once count is 1 to reload the navbar component and display "Logout" as an option instead of "Login"
                let count = 0;

                // If the response has a valid social Id
                if (res.data.socialId === response.googleId) {
                    // Set the username and isLoggedIn in the session storage
                    sessionStorage.setItem("isLoggedIn", "true");
                    sessionStorage.setItem("username", res.data.username);
                    count++;

                    // Remove the user session cookie after 24 hours, to log the user out.
                    // This is for cases when the user doesn't end the session or doesn't logout
                    window.setTimeout(() => {
                        sessionStorage.removeItem("isLoggedIn");
                        sessionStorage.removeItem("username");
                    }, 24 * 60 * 60 * 60);

                    // If user data is stored in the session Storage, then reload page to update Navbar component appropriately
                    if (count === 1) {
                        window.location.reload();
                    }
                }
                // If user data returned is invalid, then redirect to the login page once again
                else {
                    window.location = "/login";
                }
            })
            .catch((err) => console.error(err));
    }

   

    // Google login failure callback
    failureGoogleLogin(response) {
        console.error(response);
        window.location = "/login";
    }

    render() {
        return (
            <div className="container">
                <div className="login">
                    <h5>
                        Login with your social account
                        <span className="full-stop">.</span>
                    </h5>
                    <hr className="gold-hr" />
                    <div className="google">
                        <GoogleLogin
                            clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
                            buttonText="Log in With Google"
                            onSuccess={this.successGoogleLogin}
                            onFailure={this.failureGoogleLogin}
                            cookiePolicy={"single_host_origin"}
                            scope="profile"
                        />
                    </div>
                    <br />
                    
                </div>
            </div>
        );
    }
}

export default Login;
