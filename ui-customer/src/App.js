import React, {useState} from "react";
import LandingPage from './LandingPage.js'
import "bootstrap/dist/css/bootstrap.css"
import './App.css';


const App = () => {
    const [showLanding, setShowLanding] = useState(false);
    return (
        <div id="wrapper">
            <LandingPage show={showLanding} onHide={() => setShowLanding(false)}/>
        </div>
    )
};


export default App;