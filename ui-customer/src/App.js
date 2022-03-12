import React, {useState} from "react";
// import LandingPage from './LandingPage.js'
import CustomerDashboard from "./AccountDetailsPage";
import "bootstrap/dist/css/bootstrap.css"
import './App.css';
import LandingPage from "./LandingPage";


const App = () => {
    const [showLanding, setShowLanding] = useState(false);
    return (
        <div id="wrapper">
            <CustomerDashboard show={showLanding} onHide={() => setShowLanding(false)}/>
        </div>
    )
};


export default App;