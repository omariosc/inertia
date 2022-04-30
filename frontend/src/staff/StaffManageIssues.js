import React, {useEffect, useState} from "react";
import {Button, Col, Container, Form, Row} from "react-bootstrap";
import {NotificationManager} from "react-notifications";
import { useAccount } from '../authorize';
import getAge from "./getAge";
import accountRole from "./accountRole";
import host from "../host";
import priorities from "./priorities";
import userType from "./userType";

export default function StaffManageIssues({manager}) {
  const [account] = useAccount();
  const [issues, setIssues] = useState('');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(true);
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
      let request = await fetch(host + `api/admin/Issues/?closed=false${(manager) ? "&priority=3" : ""}`, {
        method: "GET",
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${account.accessToken}`
        },
        mode: "cors"
      });
      const sortFunctions = {
        '1': (a, b) => b.issueId - a.issueId,
        '2': (a, b) => a.issueId - b.issueId,
        '3': (a, b) => a.priority - b.priority,
        '4': (a, b) => b.priority - a.priority
      };
      setIssues((await request.json()).sort(sortFunctions[sortOption]));
      if (sortOption) {
        NotificationManager.success("Sorted Issues.", "Success");
      }
    } catch (error) {
      console.error(error);
    }
  }

  function toggleAdvancedFilters() {
    if (showAdvancedFilters) {
      setSearchIssueID("");
      setSearchPriority("All");
      setSearchContent("");
      setSearchAccountID("");
      setSearchAccountName("");
      setSearchAccountEmail("");
      setSearchAccountRole("All");
      setSearchAccountType("All");
      setSearchBefore("");
      setSearchAfter("");
      setShowAdvancedFilters(false);
    } else {
      setShowAdvancedFilters(true);
    }
  }

  return (
    <>
      {(manager) ?
        <p id="breadcrumb">
          <a className="breadcrumb-list" href={account.role === "2" ? "/dashboard" : "/home"}>Home
          </a> > <a className="breadcrumb-list" href="/issues">Issues</a> > <b>
          <a className="breadcrumb-current" href="/issues">High Priority Issues</a></b>
        </p> :
        <p id="breadcrumb">
          <a className="breadcrumb-list"
             href={account.role === "2" ? "/dashboard" : "/home"}>Home</a> > <b>
          <a className="breadcrumb-current" href="/issues">Issues</a></b>
        </p>
      }
      <h3 id="pageName">Issues</h3>
      <hr id="underline"/>
      <Container className="p-3">
        <div className="issue-filters">
          <Row className="p-2">
            <Col className="col-8">
              <Form.Control type="text"
                            onChange={event => {
                              setSearchTitle(event.target.value);
                            }}
                            placeholder="Search Issue Titles"/>
            </Col>
            <Col className="col-2">
              <Button type="button"
                      className={showAdvancedFilters ? "btn-danger" : "btn-primary"}
                      onClick={() => {
                        toggleAdvancedFilters();
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
                {(manager) ? null :
                  <>
                    <option value={3}>Priority: Ascending</option>
                    <option value={4}>Priority: Descending</option>
                  </>
                }
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
                  {(manager) ? <>High</> :
                    <Form.Select onChange={(e) => {
                      setSearchPriority(e.target.value);
                    }}>
                      <option value="All" key="All">All</option>
                      {priorities.map((pString, pValue) => (
                        <option value={pValue} key={pValue}>{pString}</option>
                      ))}
                    </Form.Select>
                  }
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
                    <option value="All" key="All">All</option>
                    {accountRole.map((aRString, aRValue) => (
                      <option value={aRValue} key={aRValue}>{aRString}</option>
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
                    <option value="All" key="All">All</option>
                    {userType.map((uTString, uTValue) => (
                      <option value={uTValue} key={uTString}>{uTString}</option>
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
            </>
          }
        </div>
        <div className="issue-filters-mobile">
          <Form.Control type="text"
                        onChange={event => {
                          setSearchTitle(event.target.value);
                        }}
                        placeholder="Search Issue Titles"/>
          <br/>
          <Row>
            <Col>
              <Form.Select onChange={(e) => {
                fetchIssues(e.target.value);
              }}>
                <option value={1}>Time: Newest</option>
                <option value={2}>Time: Oldest</option>
                {(manager) ? null :
                  <>
                    <option value={3}>Priority: Ascending</option>
                    <option value={4}>Priority: Descending</option>
                  </>
                }
              </Form.Select></Col>
            <Col>
              <Button type="button"
                      className="float-right"
                      variant={showAdvancedFilters ? "danger" : "primary"}
                      onClick={() => {
                        toggleAdvancedFilters();
                      }}>
                {showAdvancedFilters ? "Hide Filters" : "Show Filters"}
              </Button>
            </Col>
          </Row>
          {showAdvancedFilters &&
            <>
              <br/>
              Before
              <Form.Control type="date"
                            onChange={(event) => setSearchBefore(event.target.value)}
              />
              <br/>
              After
              <Form.Control type="date"
                            onChange={(event) => setSearchAfter(event.target.value)}
              />
              <br/>
              {(manager) ? null :
                <>
                  Priority
                  <Form.Select onChange={(e) => {
                    setSearchPriority(e.target.value);
                  }}>
                    <option value="All" key="All">All</option>
                    {priorities.map((pString, pValue) => (
                      <option value={pValue} key={pValue}>{pString}</option>
                    ))}
                  </Form.Select>
                  <br/>
                </>
              }
              Issue ID
              <Form.Control type="input"
                            onChange={(event) => setSearchIssueID(event.target.value)}
              />
              <br/>
              Account ID
              <Form.Control type="input"
                            onChange={(event) => setSearchAccountID(event.target.value)}
              />
              <br/>
              Account Type
              <Form.Select onChange={(e) => {
                setSearchAccountRole(e.target.value);
              }}>
                <option value="All" key="All">All</option>
                {accountRole.map((aRString, aRValue) => (
                  <option value={aRValue} key={aRValue}>{aRString}</option>
                ))}
              </Form.Select>
              <br/>
              Username
              <Form.Control type="input"
                            onChange={(event) => setSearchAccountName(event.target.value)}
              />
              <br/>
              Email
              <Form.Control type="input"
                            onChange={(event) => setSearchAccountEmail(event.target.value)}
              />
              <br/>
              User Type
              <Form.Select onChange={(e) => {
                setSearchAccountType(e.target.value);
              }}>
                <option value="All" key="All">All</option>
                {userType.map((uTString, uTValue) => (
                  <option value={uTValue} key={uTString}>{uTString}</option>
                ))}
              </Form.Select>
              <br/>
              Content Included
              <Form.Control as="textarea" rows={2}
                            onInput={e => setSearchContent(e.target.value)}/>
            </>
          }
        </div>
        <hr/>
        {(issues.length === 0) ? <p>There are no open issues.</p> :
          <>
            {issues.filter((issue) => {
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
              });
              if (invalid) {
                return null;
              }
              let dateBefore = new Date(searchBefore);
              dateBefore.setHours(0, 0, 0, 0);
              let dateAfter = new Date(searchAfter);
              dateAfter.setHours(0, 0, 0, 0);
              let dateOf = new Date(issue.dateOpened + "+00:00").getTime();

              if (dateOf < dateAfter.getTime() + 86400000) {
                return null;
              }
              if (dateOf >= dateBefore.getTime()) {
                return null;
              }
              return issue;
            }).map((issue) => (
              <a key={issue.issueId} className="breadcrumb-current" href={`issues/${issue.issueId}`}>
                <Row>
                  <Col xs={6} lg={8} className="issue-filters">
                    <b>{issue.title}</b>
                  </Col>
                  <Col xs={3} className="issue-filters-mobile">
                    <b>{issue.title}</b>
                  </Col>
                  <Col className="issue-filters-mobile"/>
                  <Col xs={2} className="issue-filters"/>
                  <Col className={`issue-label-${issue.priority}`}>
                    <b className="issue-text">{priorities[issue.priority]}</b>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    created by [{accountRole[issue.account.role]}] {
                    issue.account.name} · {getAge(issue.dateOpened + "+00:00")} ago
                  </Col>
                </Row>
                <hr/>
              </a>
            ))}
          </>
        }
        <br/>
      </Container>
    </>
  );
}