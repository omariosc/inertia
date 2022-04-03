import React, {useEffect, useState} from "react";
import "bootstrap/dist/css/bootstrap.css";
import host from "./host";
import Cookies from "universal-cookie";
import moment from "moment";
import {Button} from "react-bootstrap";

export default function Discounts() {
    const cookies = new Cookies();
    const [loading, setLoading] = useState('');
    const [frequentUser, setFrequent] = useState(false);
    const [studentUser, setStudentStatus] = useState(false);
    const [seniorUser, setSeniorStatus] = useState(false);
    const [studentImage, setStudentImage] = useState(null);
    const [seniorImage, setSeniorImage] = useState(null);
    const [recentHours, setHours] = useState(null);

    useEffect(() => {
        fetchDiscountStatus();
    }, []);

    async function getDiscountStatus() {
        try {
            let request = await fetch(host + `api/Users/${cookies.get('accountID')}/orders`, {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${cookies.get('accessToken')}`
                },
                mode: "cors"
            });
            let response = await request.json();
            let thresholdDate = moment().subtract(1, 'week').toISOString()
            let recentBookings = response.filter(e => e.createdAt >= thresholdDate);
            let recentHours = 0;
            for (let i = 0; i < recentBookings.length; i++) {
                recentHours += recentBookings[i].hireOption.durationInHours;
                if (recentBookings[i]["extensions"] != null) {
                    for (let j = 0; j < recentBookings[i]["extensions"].length; j++) {
                        recentHours += recentBookings[i]["extensions"][j].hireOption.durationInHours;
                    }
                }
            }
            if (recentHours >= 8) {
                setFrequent(true);
            } else {
                setHours(recentHours);
            }
        } catch (e) {
            console.log(e);
        }
    }

    async function fetchDiscountStatus() {
        try {
            let request = await fetch(host + `api/Users/${cookies.get('accountID')}/profile`, {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${cookies.get('accessToken')}`
                },
                mode: "cors"
            });
            let response = await request.json();
            if (response.userType === 0) {
                setStudentStatus(true);
            } else if (response.userType === 1) {
                setSeniorStatus(true);
            } else {
                await getDiscountStatus();
            }
            setLoading('complete');
        } catch (e) {
            console.log(e);
        }
    }

    async function onSubmit(type) {
        if ((type === 'student' && !studentImage) || (type === 'senior' && !seniorImage)) {
            alert("You must upload an image.");
            return;
        }
        try {
            let discountRequest = await fetch(host + `api/Users/${cookies.get('accountID')}/ApplyDiscount`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${cookies.get('accessToken')}`
                },
                body: JSON.stringify({
                    discountType: (type === 'student') ? 0 : 1
                }),
                mode: "cors"
            });
            let discountResponse = await discountRequest;
            if (discountResponse.status === 422) {
                alert("Already applied for discount.");
                return;
            }
            let imageRequest = await fetch(host + `api/Users/${cookies.get('accountID')}/ApplyDiscountUploadImage`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/octet-stream',
                    'Authorization': `Bearer ${cookies.get('accessToken')}`
                },
                body: (type === 'student') ? studentImage : seniorImage,
                mode: "cors"
            });
            let imageResponse = await imageRequest;
            if (imageResponse.status === 422) {
                alert("Already applied for discount.");
            } else {
                alert("Submitted application.");
            }
        } catch (e) {
            console.log(e);
        }
    }

    return (
        <>
            {(loading === '') ?
                <h6>Loading...</h6> :
                <>
                    {(!frequentUser && !studentUser && !seniorUser) ?

                        <div className="scroll">
                            <h5>Frequent User Discount</h5>
                            <p>Book {(8 - parseFloat(recentHours)).toFixed(0)} hours this week to enjoy our 10% frequent
                                user discount!</p>
                            <h5 style={{paddingTop: "5px"}}>Student Discount</h5>
                            <p>To apply for our 10% student discount, upload student ID below.</p>
                            {window.FileReader ?
                                <>
                                    {studentImage ?
                                        <>
                                            <h6>Image Preview</h6>
                                            <img alt="Uploaded Student Image"
                                                 src={URL.createObjectURL(studentImage)} width="75%"/>
                                            <br/>
                                            <br/>
                                        </>
                                        : null}
                                    <input type="file" accept="image/*"
                                           onChange={(event) => {
                                               setStudentImage(event.target.files[0]);
                                           }}
                                    />
                                    <Button onClick={() => onSubmit("student")}>Submit</Button>
                                </>
                                :
                                <p>Your browser does not support file reader. Use another browser to upload
                                    image.</p>
                            }
                            <h5 style={{paddingTop: "15px"}}>Senior Discount</h5>
                            <p>To apply for our 10% senior discount, upload ID showing senior status below.</p>
                            {window.FileReader ?
                                <>
                                    {seniorImage ?
                                        <>
                                            <h6>Image Preview</h6>
                                            <img alt="Uploaded Senior Image"
                                                 src={URL.createObjectURL(seniorImage)} width="75%"/>
                                            <br/>
                                            <br/>
                                        </>
                                        : null}
                                    <input type="file" accept="image/*"
                                           onChange={(event) => {
                                               setSeniorImage(event.target.files[0]);
                                           }}
                                    />
                                    <Button onClick={() => onSubmit("senior")}>Submit</Button>
                                </>
                                :
                                <p>Your browser does not support file reader. Use another browser to upload
                                    image.</p>
                            }
                        </div>
                        :
                        <>
                            {frequentUser ?
                                <>
                                    <h5>Frequent User Discount</h5>
                                    <p>Well Done! You are a frequent user. Enjoy our 10% frequent user discount!</p>
                                </>
                                : null
                            }
                            {studentUser ?
                                <>
                                    <h5>Student Discount</h5>
                                    <p>10% student discount applied</p>
                                </>
                                : null
                            }
                            {seniorUser ?
                                <>
                                    <h5>Senior Discount</h5>
                                    <p>10% student discount applied</p>
                                </>
                                : null
                            }
                        </>
                    }
                </>
            }
        </>
    );
};