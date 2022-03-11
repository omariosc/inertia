import React, {useState} from "react";
import LandingPage from './LandingPage.js'
import "bootstrap/dist/css/bootstrap.css"
import './App.css';


const App = () => {
    const [showLanding, setShowLanding] = useState(false);
    return (
        <div id="wrapper">
            {/*<LandingPage show={showLanding} onHide={() => setShowLanding(false)}/>*/}
            <h1>Hello World</h1>
        </div>
    )
};


export default App;