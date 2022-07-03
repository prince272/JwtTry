import 'bootstrap/dist/css/bootstrap.min.css';
import './index.js.css';

import React from 'react';
import { Nav, Navbar } from 'react-bootstrap';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';

import BooksComponent from './pages/books';
import LoginComponent from './pages/login';

import { AuthConsumer, AuthProvider } from './utils/auth';

import toast, { Toaster } from 'react-hot-toast';
import { Redirect } from 'react-router-dom';

const baseUrl = document.getElementsByTagName('base')[0].getAttribute('href');
const rootElement = document.getElementById('root');


ReactDOM.render(
  <>
    <Router basename={baseUrl}>
      <AuthProvider>
        <AuthConsumer>
          {(auth) => {

            return (
              <>
                <Navbar bg="dark" variant="dark" expand="md">
                  <div className="container">
                    <Navbar.Brand as={Link} to="/">BookStore</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                      <Nav className="ms-auto">
                        <Nav.Link as={"a"} href="/swagger">View API</Nav.Link>
                        <Nav.Link as={Link} to="/">Login</Nav.Link>
                      </Nav>
                    </Navbar.Collapse>
                  </div>
                </Navbar>

                <div className="container">
                  <Switch>
                    <Route exact path="/books">
                      <BooksComponent />
                    </Route>
                    <Route path="/">
                      <LoginComponent />
                    </Route>
                  </Switch>
                </div>

                {auth.accessToken ? <></> : <Redirect to={"/"} />}
              </>
            );
          }}
        </AuthConsumer>
      </AuthProvider>
    </Router>
    <Toaster />
  </>,
  rootElement);