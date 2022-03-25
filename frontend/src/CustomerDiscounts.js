import React, {useState} from "react";
import {Button} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.css"

function Discounts() {
    const [studentImage, setStudentImage] = useState(null);
    const [seniorImage, setSeniorImage] = useState(null);
    return (
        <>
            <h5>Frequent User Discount</h5>
            <p>Well Done! You are a frequent user. Enjoy our 10% frequent user discount!</p>
            <h5 style={{paddingTop: "5px"}}>Apply for Student Discount</h5>
            <p>To apply for our 10% student discount, upload student ID below.</p>
            <input
                type="file"
                name="studentID"
                onChange={(event) => {
                    setStudentImage(event.target.files[0]);
                    console.log(studentImage)
                }}
            />
            <Button variant="primary">Submit</Button>
            <h5 style={{paddingTop: "15px"}}>Apply for Senior Discount</h5>
            <p>To apply for our 10% senior discount, upload ID showing senior status below.</p>
            <input
                type="file"
                name="seniorID"
                onChange={(event) => {
                    setSeniorImage(event.target.files[0]);
                    console.log(seniorImage)
                }}
            />
            <Button variant="primary">Submit</Button>
        </>
    )
}

export default Discounts;
