import React from 'react';
import ReactDOM from 'react-dom';
import Trains from './Trains';

it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<Trains result={{TrainAnnouncement: []}}/>, div);
});
