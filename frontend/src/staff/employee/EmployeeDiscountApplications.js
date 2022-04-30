/*
	Purpose of file: Display all pending discount applications and allow
	a staff account to approve or deny them
*/

import React, {useEffect, useState} from "react";
import {Button, Container, Table} from "react-bootstrap";
import {NotificationManager} from "react-notifications";
import { useAccount } from '../../authorize';
import host from "../../host";
import {useNavigate} from "react-router-dom";

/**
 * Returns the employee discount application page, shows a list of
 * current applications
 */
export default function EmployeeDiscountApplications() {
    const navigate = useNavigate();
    const [account] = useAccount();
    const [applications, setApplications] = useState('');
    const [image, setImage] = useState(null);
    const applicationType = ["Student", "Senior"];

    useEffect(() => {
        fetchApplications();
    }, []);

		/**
		 * Gets list of current applications from backend server
		 */
    async function fetchApplications() {
        try {
            let request = await fetch(host + `api/admin/DiscountApplications`, {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${account.accessToken}`
                },
                mode: "cors"
            });
            setApplications(await request.json());
        } catch (e) {
            console.log(e);
        }
    }

		/**
		 * Updates an application with specified ID based on the choice (approved/denied)
		 * made by the staff account
		 */
    async function applicationAction(id, choice) {
        try {
            await fetch(host + `api/admin/DiscountApplications/${id}/${choice}`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${account.accessToken}`
                },
                mode: "cors"
            });
            NotificationManager.success(`${(choice === "Deny") ? "Denied" : "Approved"} application.`, "Success");
            await fetchApplications();
        } catch (e) {
            console.log(e);
        }
    }

		/**
		 * Gets the provided image (e.g. Student ID) for the provided application ID from
		 * the backend server
		 */
    async function getImage(id) {
        try {
            let request = await fetch(host + `api/admin/DiscountApplications/${id}/Image`, {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${account.accessToken}`
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
                <a className="breadcrumb-list" onClick={() => {navigate("/home")}}>Home</a> &gt; <b>
                <a className="breadcrumb-current" onClick={() => {navigate("/discount-applications")}}>Discount Applications</a></b>
            </p>
            <h3 id="pageName">Manage Discount Applications</h3>
            <hr id="underline"/>
            <Container className="responsive-table">
                {(applications === '') ?
                    <p>Loading discount applications...</p> :
                    <>
                        {(applications.length === 0) ?
                            <p>There are currently no discount applications.</p> :
                            <>
                                {image ?
                                    <>
                                        <p><b>Image Preview</b></p>
                                        <img alt="Image Preview" src={URL.createObjectURL(image)} height="300px"/>
                                        <br/>
                                        <br/>
                                    </>
                                    : null
                                }
                                <Table className="table-formatting">
                                    <thead>
                                    <tr>
                                        <th className="minWidthFieldSmall">Customer Name</th>
                                        <th className="minWidthFieldSmall">Customer Email</th>
                                        <th className="minWidthFieldSmall">Application Type</th>
                                        <th className="minWidthFieldSmall">Photo Link</th>
                                        <th className="minWidthFieldSmall">Action</th>
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
                                                    variant="success" className="float-left half-width">Approve</Button>
                                                <Button
                                                    onClick={() => applicationAction(application.discountApplicationId, "Deny")}
                                                    variant="danger" className="float-right half-width">Reject</Button>
                                            </td>
                                        </tr>

                                    ))}
                                    </tbody>
                                </Table>
                            </>
                        }
                    </>
                }
            </Container>
        </>
    );
};