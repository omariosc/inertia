import React, {useEffect, useState} from "react";
import {Button, Col, Container, Form, Row} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import priorities from "../priorities";
import host from "../../host";
import Cookies from "universal-cookie";
import accountRole from "../accountRole";
import userType from "../userType";

export default function EmployeeManageIssues() {
    const cookies = new Cookies();
    const [showAdvancedFilters, setShowAdvancedFilters] = useState(true);
    const [issues, setIssues] = useState('');
    const [searchTitle, setSearchTitle] = useState("");
    const [searchIssueID, setSearchIssueID] = useState("");
    const [searchPriority, setSearchPriority] = useState("All");
    const [searchContent, setSearchContent] = useState("");
    const [searchAccountID, setSearchAccountID] = useState("");
    const [searchAccountName, setSearchAccountName] = useState("");
    const [searchAccountEmail, setSearchAccountEmail] = useState("");
    const [searchAccountRole, setSearchAccountRole] = useState("All");
    const [searchAccountType, setSearchAccountType] = useState("All");
    const [searchBefore, setSearchBefore] = useState("");
    const [searchAfter, setSearchAfter] = useState("");


    useEffect(() => {
        fetchIssues();
    }, []);

    async function fetchIssues(sortOption = null) {
        try {
            let request = await fetch(host + "api/admin/Issues/?closed=false", {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${cookies.get('accessToken')}`
                },
                mode: "cors"
            });
            let response = await request.json();
            const sortFunctions = {
                '1': (a, b) => b.issueId - a.issueId,
                '2': (a, b) => a.issueId - b.issueId,
                '3': (a, b) => a.priority - b.priority,
                '4': (a, b) => b.priority - a.priority
            }
            setIssues(response.sort(sortFunctions[sortOption]));
        } catch (error) {
            console.error(error);
        }
    }

    function getAge(dateString){
        let openedAt = new Date(dateString);
        let current = new Date(Date.now())
        let difference = current.getTime() - openedAt.getTime()
        console.log(openedAt);
        console.log(current);
        let days =  Math.floor(difference / 86400000);
        if(days >= 1) {
            if (days === 1){
                return "1 day";
            } else {
                return days.toString() +  " days";
            }
        }
        let hours =  Math.floor(difference / 3600000);
        if(hours >= 1) {
            if (hours === 1){
                return "1 hour";
            } else {
                return hours.toString() +  " hours";
            }
        }
        let mins =  Math.floor(difference / 60000);
        if(mins >= 1) {
            if (mins === 1){
                return "1 minute";
            } else {
                return mins.toString() +  " minutes";
            }
        } else {
            return "less than a minute"
        }
    }


    return (
        <>
            <p id="breadcrumb">
                <a className="breadcrumb-list" href="/dashboard">Home</a> > <b>
                <a className="breadcrumb-current" href="/issues">Issues</a></b>
            </p>
            <Container className={"p-3"}>
                {(issues.length === 0) ? <p>There are no open issues.</p> :
                    <>

                        <Row className="p-2">
                            <Col className="col-8">
                                <Form.Control type="text"
                                              onChange={event => {
                                                  setSearchTitle(event.target.value)
                                              }}
                                              placeholder="Search Issue Titles"/>
                            </Col>
                            <Col className="col-2">
                                <Button type="button"
                                        className={showAdvancedFilters ? "btn-danger" : "btn-primary"}
                                        onClick={() => {
                                            setShowAdvancedFilters(!showAdvancedFilters)
                                        }}>
                                    {showAdvancedFilters ? "Hide Filters" : "Show Filters"}

                                </Button>
                            </Col>

                            <Col>
                                <Form.Select onChange={(e) => {
                                    fetchIssues(e.target.value);
                                }}>
                                    <option value={1}>Time: Newest</option>
                                    <option value={2}>Time: Oldest</option>
                                    <option value={3}>Priority: Ascending</option>
                                    <option value={4}>Priority: Descending</option>
                                </Form.Select>
                            </Col>


                        </Row>
                        {showAdvancedFilters &&
                            <>
                                <Row className="p-2">
                                    <Col className="col-2">
                                        Before
                                    </Col>
                                    <Col className="col-2">
                                        <Form.Control type="date"
                                                      onChange={(event) => setSearchBefore(event.target.value)}
                                        />
                                    </Col>
                                    <Col className="col-2">
                                        After
                                    </Col>
                                    <Col className="col-2">
                                        <Form.Control type="date"
                                                      onChange={(event) => setSearchAfter(event.target.value)}
                                        />
                                    </Col>
                                    <Col className="col-2">
                                        Priority
                                    </Col>
                                    <Col className="col-2">
                                        <Form.Select onChange={(e) => {
                                            setSearchPriority(e.target.value);
                                        }}>
                                            <option value="All">All</option>
                                            {priorities.map((pString, pValue) => (
                                                <option value={pValue}>{pString}</option>
                                            ))}
                                        </Form.Select>
                                    </Col>
                                </Row>
                                <Row className="p-2">

                                    <Col className="col-2">
                                        Issue ID
                                    </Col>
                                    <Col className="col-2">
                                        <Form.Control type="input"
                                                      onChange={(event) => setSearchIssueID(event.target.value)}
                                        />
                                    </Col>
                                    <Col className="col-2">
                                        Account ID
                                    </Col>
                                    <Col className="col-2">
                                        <Form.Control type="input"
                                                      onChange={(event) => setSearchAccountID(event.target.value)}
                                        />
                                    </Col>
                                    <Col className="col-2">
                                        Account Type
                                    </Col>
                                    <Col className="col-2">
                                        <Form.Select onChange={(e) => {
                                            setSearchAccountRole(e.target.value);
                                        }}>
                                            <option value="All">All</option>
                                            {accountRole.map((aRString, aRValue) => (
                                                <option value={aRValue}>{aRString}</option>
                                            ))}
                                        </Form.Select>
                                    </Col>
                                </Row>
                                <Row className="p-2">
                                    <Col className="col-2">
                                        Username
                                    </Col>
                                    <Col className="col-2">
                                        <Form.Control type="input"
                                                      onChange={(event) => setSearchAccountName(event.target.value)}
                                        />
                                    </Col>
                                    <Col className="col-2">
                                        Email
                                    </Col>
                                    <Col className="col-2">
                                        <Form.Control type="input"
                                                      onChange={(event) => setSearchAccountEmail(event.target.value)}
                                        />
                                    </Col>
                                    <Col className="col-2">
                                        User Type
                                    </Col>
                                    <Col className="col-2">
                                        <Form.Select onChange={(e) => {
                                            setSearchAccountType(e.target.value);
                                        }}>
                                            <option value="All">All</option>
                                            {userType.map((uTString, uTValue) => (
                                                <option value={uTValue}>{uTString}</option>
                                            ))}
                                        </Form.Select>
                                    </Col>
                                </Row>
                                <Row className="p-2">
                                    <Col className="col-2">
                                        Content Included
                                    </Col>
                                    <Col className="col-10">
                                        <Form.Control as="textarea" rows={2}
                                                      onInput={e => setSearchContent(e.target.value)}/>

                                    </Col>
                                </Row>
                            </>}
                        <hr/>
                        {issues.filter((issue, idx) => {
                            if (searchTitle !== "" && !(issue.title.toLowerCase().includes(searchTitle.toLowerCase()))) {
                                return null;
                            }
                            if (searchIssueID !== "" && searchIssueID !== issue.issueId.toString()) {
                                return null;
                            }

                            if (searchPriority !== "All" && searchPriority !== issue.priority.toString()) {
                                return null;
                            }
                            if (searchAccountID !== "" && searchAccountID !== issue.accountId) {
                                return null;
                            }
                            if (searchAccountName !== "" && searchAccountName !== issue.account.name) {
                                return null;
                            }
                            if (searchAccountEmail !== "" && !(issue.account.email.toLowerCase().includes(searchAccountEmail.toLowerCase()))) {
                                return null;
                            }
                            if (searchAccountRole !== "All" && searchAccountRole !== issue.account.role.toString()) {
                                return null;
                            }
                            if (searchAccountType !== "All" && searchAccountType !== issue.account.userType.toString()) {
                                return null;
                            }
                            let invalid = false;
                            searchContent.split(" ").forEach((term) => {
                                if (!issue.content.toLowerCase().includes(term.toLowerCase())) {
                                    invalid = true;
                                }
                            })
                            if(invalid){
                                return null;
                            }
                            let dateBefore = new Date(searchBefore)
                            dateBefore.setHours(0,0,0,0);
                            let dateAfter = new Date(searchAfter);
                            dateAfter.setHours(0,0,0,0);
                            let dateOf = new Date(issue.dateOpened+"+00:00").getTime();

                            if (dateOf < dateAfter.getTime() + 86400000) {
                                return null;
                            }
                            if (dateOf >= dateBefore.getTime()) {
                                return null;
                            }
                            return issue;
                        }).map((issue, idx) => (
                            <a key={issue.issueId} className="breadcrumb-current" href={`issues/${issue.issueId}`}>
                                <Row>
                                    <Col xs={3}>
                                        <b>{issue.title}</b>
                                    </Col>
                                    <Col xs={6} xg={7} xl={8}/>
                                    <Col className={`issue-label-${issue.priority}`}>
                                        <b className="issue-text">{priorities[issue.priority]}</b>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        created by [{accountRole[issue.account.role]}] {
                                        issue.account.name} · { getAge(issue.dateOpened+"+00:00")} ago
                                    </Col>
                                </Row>
                                <hr/>
                            </a>
                        ))}
                    </>
                }
            </Container>
        </>
    );
};



