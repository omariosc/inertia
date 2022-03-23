import React, {useState} from "react";
import {Button, Table} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.css"

function AccountInformation() {
    const userDetails = [
        ["Full Name", "Hashir Choudry"],
        ["Email Address", "hashirsing@gmail.com"]
    ];
    const [studentImage, setStudentImage] = useState(null);
    const [seniorImage, setSeniorImage] = useState(null);
    return (
        <>
            <Table>
                <tbody>
                {userDetails.map((title, info) => (
                    <tr key={info}>
                        <td>{title[0]}</td>
                        <td>{title[1]}</td>
                    </tr>
                ))}
                </tbody>
            </Table>
            <br/>
            <h5>Discounts</h5>
            <h6 style={{paddingTop: "15px"}}>Frequent User Discount</h6>
            <p>Well Done! You are a frequent user. Enjoy our 10% frequent user discount!</p>
            <h6>Apply for Student Discount</h6>
            <p>To apply for our 10% student discount, upload student ID below.</p>
            <input
                type="file"
                name="studentID"
                onChange={(event) => {
                    setStudentImage(event.target.files[0]);
                    console.log(studentImage);
                }}
            />
            <Button variant="primary">Submit</Button>
            <h6 style={{paddingTop: "15px"}}>Apply for Senior Discount</h6>
            <p>To apply for our 10% senior discount, upload ID showing senior status below.</p>
            <input
                type="file"
                name="seniorID"
                onChange={(event) => {
                    setSeniorImage(event.target.files[0]);
                    console.log(seniorImage);
                }}
            />
            <Button variant="primary">Submit</Button>
        </>
    );
}

export default AccountInformation;
