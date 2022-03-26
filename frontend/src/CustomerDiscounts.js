import React, {useState} from "react";
import {Button} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.css";

export default function Discounts() {
    const [studentImage, setStudentImage] = useState(null);
    const [seniorImage, setSeniorImage] = useState(null);
    const [frequentUser, setFrequent] = useState(true);
    const [studentUser, setStudentStatus] = useState(false);
    const [seniorUser, setSeniorStatus] = useState(false);
    return (
        <>
            <h5>Frequent User Discount</h5>
            {frequentUser ?
                <p>Well Done! You are a frequent user. Enjoy our 10% frequent user discount!</p>
                :
                <>
                    <p>Book 8 more hours this week to enjoy our 10% frequent user discount!</p>
                    {studentUser ?
                        <>
                            <h5 style={{paddingTop: "5px"}}>Student Discount</h5>
                            <p>10% student discount applied</p>
                        </> : null}
                    {(!studentUser && !seniorUser) ?
                        <>
                            <h5 style={{paddingTop: "5px"}}>Student Discount</h5>
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
                        </> : null
                    }
                    {seniorUser ?
                        <>
                            <h5 style={{paddingTop: "15px"}}>Senior Discount</h5>
                            <p>10% student discount applied</p>
                        </> : null}
                    {(!studentUser && !seniorUser) ?
                        <>
                            <h5 style={{paddingTop: "15px"}}>Senior Discount</h5>
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
                        </> : null
                    }
                </>
            }
        </>
    )
}