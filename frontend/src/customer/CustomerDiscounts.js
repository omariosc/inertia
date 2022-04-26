import React, {useEffect, useState} from "react";
import {Button} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.css";
import {NotificationManager} from "react-notifications";
import host from "../host";
import moment from "moment";
import Cookies from "universal-cookie";
import {useNavigate} from "react-router-dom";

export default function CustomerDiscounts() {
    const cookies = new Cookies();
    let navigate = useNavigate();
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
            let thresholdDate = moment().subtract(1, 'week').toISOString();
            let recentBookings = response.filter(e => e.createdAt >= thresholdDate);
            let recentHours = 0;
            for (let i = 0; i < recentBookings.length; i++) {
                if (recentBookings[i].orderState !== 0 && recentBookings[i].orderState !== 6) {
                    recentHours += recentBookings[i].hireOption.durationInHours;
                    if (recentBookings[i]["extensions"] != null) {
                        for (let j = 0; j < recentBookings[i]["extensions"].length; j++) {
                            recentHours += recentBookings[i]["extensions"][j].hireOption.durationInHours;
                        }
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
            NotificationManager.error("You must upload an image.", "Error");
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
                NotificationManager.error("Already applied for discount.", "Error");
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
                NotificationManager.error("Already applied for discount.", "Error");
            } else {
                NotificationManager.success("Submitted application.", "Success");
                navigate('/create-booking');
            }
        } catch (e) {
            console.log(e);
        }
    }

    return (
        <>
            {(loading === '') ?
                <p>Loading discount status...</p> :
                <>
                    {(!frequentUser && !studentUser && !seniorUser) ?
                        <>
                            <h5>Frequent User Discount</h5>
                            <p>Book {(8 - parseFloat(recentHours)).toFixed(0)} hours this week to enjoy our 10% frequent
                                user discount!</p>
                            <br/>
                            <h5>Student Discount</h5>
                            <p>To apply for our 10% student discount, upload student ID below.</p>
                            {window.FileReader ?
                                <>
                                    {studentImage ?
                                        <>
                                            <p><b>Image Preview</b></p>
                                            <img alt="Uploaded Student Image"
                                                 src={URL.createObjectURL(studentImage)} height="300px"/>
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
                            <br/>
                            <br/>
                            <h5>Senior Discount</h5>
                            <p>To apply for our 10% senior discount, upload ID showing senior status below.</p>
                            {window.FileReader ?
                                <>
                                    {seniorImage ?
                                        <>
                                            <p><b>Image Preview</b></p>
                                            <img alt="Uploaded Senior Image"
                                                 src={URL.createObjectURL(seniorImage)} height="300px"/>
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
                        </>
                        :
                        <>
                            {frequentUser ?
                                <>
                                    <h5>Frequent User Discount</h5>
                                    <p>Well Done! You are a frequent user. Enjoy our 10% frequent user discount!</p>
                                </> : studentUser ?
                                    <>
                                        <h5>Student Discount</h5>
                                        <p>10% student discount applied.</p>
                                    </> : seniorUser ?
                                        <>
                                            <h5>Senior Discount</h5>
                                            <p>10% student discount applied.</p>
                                        </> : null
                            }
                        </>
                    }
                </>
            }
        </>
    );
};