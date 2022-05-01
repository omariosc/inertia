import {
  Button,
  Col,
  Container,
  Form,
  ListGroup,
  ListGroupItem,
  Row,
} from 'react-bootstrap';
import {useNavigate, useOutletContext} from 'react-router-dom';
import '../../MainPage.css';
import React, {useEffect, useState} from 'react';
import depot1Img from '../../imgs/depot_1_picture.jpeg';
import depot2Img from '../../imgs/depot_2_picture.jpeg';
import depot3Img from '../../imgs/depot_3_picture.jpg';
import depot4Img from '../../imgs/depot_4_picture.jpeg';
import depot5Img from '../../imgs/depot_5_picture.jpeg';

/**
 * Creates the depot entry booking element
 * @return {JSX.Element}
 */
export default function DepotEntry() {
  const [search, setSearch, depots] = useOutletContext();
  const depotImages = [depot1Img, depot2Img, depot3Img, depot4Img, depot5Img];
  const [depotChoiceId, setDepotChoiceId] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    navigate(`booking/${depotChoiceId}`);
  }, [depotChoiceId]);

  return (
    <>
      <div className={'search-bar'}>
        <Form.Control type="text" value={search} onChange={(e) => {
          setSearch(e.target.value);
        }}/>
      </div>
      <div className={'content'}>
        <Container className={'search-results '}>
          <h4> Search results </h4>
          <ListGroup className="p-1 border-0">
            {depots !== null &&
                  depots.filter((depot) => {
                    if (search === '') {
                      return depot;
                    } else if (depot.name.toString().
                        toLowerCase().
                        includes(search.toLowerCase())) {
                      return depot;
                    }
                    return null;
                  }).map((depot, idx) => {
                    return (
                      <ListGroupItem
                        className={'border-end-0 border-start-0 rounded-0'}
                        key={idx}>
                        <Container className="p-0">
                          <Row className="p-0 align-items-center text-center">
                            <Col className="col-4 p-0 image-col">
                              <img className="image-view"
                                src={depotImages[depot.depoId - 1]}
                                alt={depot.name}
                                width={100} height={100}/>
                            </Col>
                            <Col>
                              <b>{depot.name}</b>
                            </Col>
                            <Col className="float-right col-4">
                              <Button onClick={() => {
                                setDepotChoiceId(depot.depoId);
                              }
                              }>Book</Button>
                            </Col>
                          </Row>
                        </Container>
                      </ListGroupItem>
                    );
                  })}
          </ListGroup>
        </Container>
      </div>
    </>
  );
}
