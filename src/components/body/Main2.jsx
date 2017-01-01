import React from 'react';
import Button from 'react-bootstrap/lib/Button';
import Grid from 'react-bootstrap/lib/Grid';
import Jumbotron from 'react-bootstrap/lib/Jumbotron';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import Popover from 'react-bootstrap/lib/Popover';
import Tooltip from 'react-bootstrap/lib/Tooltip';
import Modal from 'react-bootstrap/lib/Modal';
import HeaderNavigation from '../header/HeaderNavigation';
import Footer from '../footer/Footer';
import Login from './Login';
import SignUp from './SignUp';
import axios from 'axios';

export default class Main2 extends React.Component {
  constructor(props) {
    super(props);
    this.scrapeDetails = this.scrapeDetails.bind(this);
    this.scrapeList = this.scrapeList.bind(this);
    this.scrapeRows = this.scrapeRows.bind(this);
    this.state = {
      list: [],
      details: {}
    }
  }

  scrapeDetails(e) {
    e.preventDefault();

    axios({
      method: 'get',
      url: '/scrape_details/5938001667'
    }).then((res) => {
      console.log(res);
    }).catch((err) => {
      // notify.show(err.response.data.errors[0].messages[0], 'error', 3000);
    });
  }

  scrapeList(e) {
    e.preventDefault();

    axios({
      method: 'get',
      url: '/scrape_list/seattle'
    }).then((res) => {
      console.log(res);
      this.setState({list: res.data});
    }).catch((err) => {
      // notify.show(err.response.data.errors[0].messages[0], 'error', 3000);
    });
  }

  scrapeRows(e) {
    let details = [];
    console.log(this.state.list.data);

    this.state.list.map((el) => {
      if (el.url){
        axios({
          method: 'get',
          url: `/scrape_details${el.urlnum}/`
        }).then((res) => {
          details.push(res.data);
          this.setState({details});
        }).catch((err) => {
          // if (err.response.status === 503) {
          //   let count = 0;
          //
          //   while (count < 10 && err.response.status === 503) {
          //     count++;
          //
          //     axios({
          //       method: 'get',
          //       url: `/scrape_details/${el.url}`
          //     }).then((res1) => {
          //       err = res1;
          //       details.push(res.data);
          //     }).catch((err1) => {
          //       err1 = err
          //       console.log(`count: ${count}`);
          //       console.log(err);
          //     })
          //   }
          // }
          details.push(err);
          this.setState({details});
        });
      } else {
        details.push(null);
        this.setState({details});
      }
    })
    console.log(details);
  }

  render() {
    return (
      <div>
        <Button onClick={this.scrapeDetails}>get details</Button>
        <Button onClick={this.scrapeList}>get list</Button>
        <Button onClick={this.scrapeRows}>get row scrapes</Button>
        {/* <Button onClick={console.log(this.state.list)}>log list</Button> */}
        <Jumbotron>
          <Grid>
            <h1>Hello, world!</h1>
            <p>This is a template for a simple marketing or informational website. It includes a large callout called a jumbotron and three supporting pieces of content. Use it as a starting point to create something more unique.</p>
          </Grid>

        </Jumbotron>
        <Grid>
          <Row>
            <Col md={4}>
              <h2>Heading</h2>
              <p>Adipisicing ratione incidunt eaque expedita rerum porro inventore. Nihil sit ipsam iure officiis sit eos at quibusdam natus dignissimos natus dolore! Vel doloremque ipsa alias nihil harum laborum necessitatibus rerum?</p>
              <p>
                <Button>View details »</Button>
              </p>
            </Col>
            <Col md={4}>
              <h2>Heading</h2>
              <p>Sit quia nemo quis enim provident porro eaque accusamus tenetur provident aliquid commodi? Velit nesciunt maiores obcaecati totam praesentium sint vitae exercitationem quaerat maxime iusto et! Consequatur aspernatur sit impedit.</p>
              <p>
                <Button>View details »</Button>
              </p>
            </Col>
            <Col md={4}>
              <h2>Heading</h2>
              <p>Dolor aliquid dolores perferendis repellendus cum! Quam maiores blanditiis cupiditate voluptatibus voluptas aliquid nisi placeat tempora. Rem debitis accusamus pariatur officia corrupti. Architecto fuga reiciendis quos rem hic? Suscipit dignissimos.</p>
              <p>
                <Button>View details »</Button>
              </p>
            </Col>
          </Row>
        </Grid>
        <Modal show={this.props.showModal} onHide={this.props.close}>
          <Modal.Header closeButton>
            <Modal.Title>Modal heading</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Grid>
              <Row>
                <Col md={4}>
                  <Login logIn={this.props.logIn}
                    logOut={this.props.logOut}
                    handleChange={this.props.handleChange}
                    email={this.props.email}
                    lastName={this.props.lastName}
                    firstName={this.props.firstName} />
                </Col>
              </Row>
            </Grid>
            <Grid>
              <Row>
                <Col md={4}>
                  <Row>
                    <SignUp
                      signUp={this.props.signUp}
                      handleChange={this.props.handleChange}
                      email={this.props.email}
                      firstName={this.props.firstName}
                      lastName={this.props.lastName}
                      password={this.props.password}/>
                  </Row>
                </Col>
              </Row>
            </Grid>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.props.close}>Close</Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}