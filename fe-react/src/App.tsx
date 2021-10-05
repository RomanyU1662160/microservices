import React from 'react';
import logo from './logo.svg';
import './App.css';
import PostsProvider from './contexts/postsContext';

function App() {
  return (
    <>
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
      </header>
      <PostsProvider>
        <div className="App"></div>
      </PostsProvider>
    </>
  );
}

export default App;
