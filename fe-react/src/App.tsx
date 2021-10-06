import React from 'react';
import logo from './logo.svg';
import './App.css';
import PostsProvider from './contexts/postsContext';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import PostsPage from './components/pages/PostsPage';

function App() {
  return (
    <>
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
      </header>
      <PostsProvider>
        <Router>
          <div className="App">
            <Switch>
              <Route exact path="/posts" component={PostsPage}></Route>
            </Switch>
          </div>
        </Router>
      </PostsProvider>
    </>
  );
}

export default App;
