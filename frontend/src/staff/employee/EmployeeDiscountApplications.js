import React, {useEffect, useState} from "react";
import {Button, Container, Table} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import host from "../../host";
import Cookies from "universal-cookie";

export default function EmployeeDiscountApplications() {
    const cookies = new Cookies();
    const [applications, setApplications] = useState('');
    const [image, setImage] = useState(null);
    const applicationType = ["Student", "Senior"];

    useEffect(() => {
        fetchApplications();
    }, []);

    async function fetchApplications() {
        try {
            let request = await fetch(host + `api/admin/DiscountApplications`, {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${cookies.get('accessToken')}`
                },
                mode: "cors"
            });
            setApplications(await request.json());
        } catch (e) {
            console.log(e);
        }
    }

    async function applicationAction(id, choice) {
        try {
            await fetch(host + `api/admin/DiscountApplications/${id}/${choice}`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${cookies.get('accessToken')}`
                },
                mode: "cors"
            });
            await fetchApplications();
        } catch (e) {
            console.log(e);
        }
    }

    async function getImage(id) {
        try {
            let request = await fetch(host + `api/admin/DiscountApplications/${id}/Image`, {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${cookies.get('accessToken')}`
                },
                mode: "cors"
            });
            setImage(await request.blob());
        } catch (e) {
            console.log(e);
        }
    }

    return (
        <>
            <p id="breadcrumb">
                <a className="breadcrumb-list" href="/dashboard">Home</a> > <b>
                <a className="breadcrumb-current" href="/discount-applications">Discount Applications</a></b>
            </p>
            <h3 id={"pageName"}>Manage Discount Applications</h3>
            <hr id="underline"/>
            <br/>
            <Container>
                {(applications === '') ?
                    <h6>Loading discount applications...</h6> :
                    <>
                        {(applications.length === 0) ?
                            <h6>There are currently no discount applications.</h6> :
                            <div className="scroll" style={{maxHeight: "40rem", overflowX: "hidden"}}>
                                {image ?
                                    <>
                                        <h6>Image Preview</h6>
                                        <img alt="Image Preview" src={URL.createObjectURL(image)} height="300px"/>
                                        <br/>
                                        <br/>
                                    </>
                                    : null
                                }
                                <Table striped bordered hover>
                                    <thead>
                                    <tr>
                                        <th>Customer Name</th>
                                        <th>Customer Email</th>
                                        <th>Application Type</th>
                                        <th>Photo Link</th>
                                        <th>Action</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {applications.map((application, idx) => (
                                        <tr key={idx}>
                                            <td>{application.account.name}</td>
                                            <td>{application.account.email}</td>
                                            <td>{applicationType[application.disccountType]}</td>
                                            <td>
                                                <Button onClick={() => getImage(application.discountApplicationId)}>
                                                    View
                                                </Button>
                                            </td>
                                            <td>
                                                <Button
                                                    onClick={() => applicationAction(application.discountApplicationId, "Approve")}
                                                    variant="success" style={{float: 'left', width: '47.5%'}}>
                                                    Approve
                                                </Button>
                                                <Button
                                                    onClick={() => applicationAction(application.discountApplicationId, "Deny")}
                                                    variant="danger" style={{float: 'right', width: '47.5%'}}>
                                                    Reject
                                                </Button>
                                            </td>
                                        </tr>

                                    ))}
                                    </tbody>
                                </Table>
                            </div>
                        }
                    </>
                }
            </Container>
        </>
    );
};