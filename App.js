// App.js

import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
// import Home from './Home';
import SearchComponent from './searchComponent';

function App() {
    return (
        <Router>
            <Switch>
                <Route path="/" component={SearchComponent}/>
            </Switch>
        </Router>
    );
}

export default App;
