import React from 'react';
import Button from 'react-bootstrap/lib/Button';
import Grid from 'react-bootstrap/lib/Grid';
import Jumbotron from 'react-bootstrap/lib/Jumbotron';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import Modal from 'react-bootstrap/lib/Modal';
// import LearnMore from './LearnMore';
import Login from './Login';
import SignUp from './SignUp';

export default class Body extends React.Component {
  constructor(props) {
    super(props);
    this.close = this.close(this);
  }

  close () {
    this.props.close();
  }

  render() {
    return (
      <div>
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
                  <Login logIn={this.props.logIn} logout={this.props.logout} handleChange={this.props.handleChange} email={this.props.email} lastName={this.props.lastName} firstName={this.props.firstName} />
                </Col>
              </Row>
            </Grid>
            <Grid>
              <Row>
                <Col md={4}>
                  <Row>
                    <SignUp
                      signUp={this.props.signUp} handleChange={this.props.handleChange}
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