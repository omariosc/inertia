import React from "react";
import {Button, Container, Table} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import './StaffInterface.css';

export default function DiscountApplications() {
    const applications = [
        [3, "Student", "sc20osc@leeds.ac.uk", "17/03/22 12:54"],
        [4, "Student", "sc20jdr@leeds.ac.uk", "18/03/22 18:53"],
        [6, "Senior", "oldman123@gmail.com", "24/03/22 15:33"]
    ]
    return (
        <>
            <h1 style={{paddingLeft: '10px'}}>Manage Discount Applications</h1>
            <br/>
            <Container>
                <div className="scroll" style={{maxHeight: "40rem", overflowX: "hidden"}}>
                    <Table striped bordered hover>
                        <thead>
                        <tr>
                            <th>User ID</th>
                            <th>Application Type</th>
                            <th>Email Address</th>
                            <th>Time Submitted</th>
                            <th>Photo Link</th>
                            <th>Action</th>
                        </tr>
                        </thead>
                        <tbody>
                        {applications.map((application) => (
                            <tr>
                                <td>{application[0]}</td>
                                <td>{application[1]}</td>
                                <td>{application[2]}</td>
                                <td>{application[3]}</td>
                                <td><u>View</u></td>
                                <td>
                                    <Button style={{float: 'left', width: '47.5%'}} variant="success">Approve</Button>
                                    <Button style={{float: 'right', width: '47.5%'}} variant="danger">Reject</Button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </Table>
                </div>
            </Container>
        </>
    );
}