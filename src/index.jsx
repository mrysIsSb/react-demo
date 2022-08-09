import React from 'react';
import { render } from 'react-dom';
import { Router } from 'react-router';
import route from './routes'
render((
    <Router basename='hello' children={route.children}>
    </Router>
), document.getElementById('body'));