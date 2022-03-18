import React from "react";
import {Button, Container, Table} from "react-bootstrap";
import './StaffInterface.css'

function ManageApplications() {
    const applications = [
        [3, "Student", "sc20osc", "17/03/22 12:54"],
        [4, "Student", "sc20jdr", "18/03/22 18:53"],
        [6, "Senior", "oldman123", "24/03/22 15:33"]
    ]
    return (
        <>
            <h1 style={{paddingLeft: '10px'}}>Manage Applications</h1>
            <br/>
            <Container>
                <div className="scroll-graphs">
                    <Table striped bordered hover>
                        <thead>
                        <tr>
                            <th>User ID</th>
                            <th>Application Type</th>
                            <th>Username</th>
                            <th>Time Submitted</th>
                            <th>Photo Link</th>
                            <th>Action</th>
                        </tr>
                        </thead>
                        <tbody>
                        {applications.map((application, idx) => (
                            <tr>
                                <td key={idx}>{application[0]}</td>
                                <td key={idx}>{application[1]}</td>
                                <td key={idx}>{application[2]}</td>
                                <td key={idx}>{application[3]}</td>
                                <td key={idx}><u>View</u></td>
                                <td key={idx}>
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

export default ManageApplications;