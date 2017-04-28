import React from 'react'
import ReactTestUtils from 'react-dom/test-utils'
import Trains from './Trains'

it('renders one train', () => {
    const div = document.createElement('div')
    const result = {
        TrainAnnouncement: [{
            'ActivityType': 'Avgang',
            'AdvertisedTrainIdent': '2909',
            'LocationSignature': 'Söc',
            'ToLocation': [{'LocationName': 'Tu', 'Priority': 1, 'Order': 0}],
            'TimeAtLocation': '2017-02-06T07:42:00'
        }]
    }
    const trains = ReactTestUtils.renderIntoDocument(<Trains result={result}/>, div)
    const trainsDiv = ReactTestUtils.findRenderedDOMComponentWithClass(trains, 'trains')
    expect(trainsDiv.children).toHaveLength(1)
    expect(trainsDiv.children[0].textContent).toBe('2909 mot Tu avg Söc  07:42')
})

it('renders two trains', () => {
    const div = document.createElement('div')
    const result = {
        TrainAnnouncement: [{
            'ActivityType': 'Avgang',
            'AdvertisedTrainIdent': '2653',
            'LocationSignature': 'Äs',
            'TimeAtLocation': '2017-02-07T18:11:00'
        }, {
            'ActivityType': 'Ankomst',
            'AdvertisedTrainIdent': '2853',
            'LocationSignature': 'Äs',
            'TimeAtLocation': '2017-02-07T18:12:00'
        }]
    }
    const trains = ReactTestUtils.renderIntoDocument(<Trains result={result}/>, div)
    const trainsDiv = ReactTestUtils.findRenderedDOMComponentWithClass(trains, 'trains')
    expect(trainsDiv.children).toHaveLength(2)
    expect(trainsDiv.children[0].textContent).toBe('2853 mot  ank Äs  18:12')
})

it('Avgang is considered more recent than Ankomst', () => {
    const div = document.createElement('div')
    const result = {
        TrainAnnouncement: [{
            'ActivityType': 'Ankomst',
            'AdvertisedTrainIdent': '2608',
            'LocationSignature': 'Ke',
            'TimeAtLocation': '2017-02-02T07:14:00'
        }, {
            'ActivityType': 'Avgang',
            'AdvertisedTrainIdent': '2608',
            'LocationSignature': 'Ke',
            'TimeAtLocation': '2017-02-02T07:14:00'
        }]
    }
    const trains = ReactTestUtils.renderIntoDocument(<Trains result={result}/>, div)
    const trainsDiv = ReactTestUtils.findRenderedDOMComponentWithClass(trains, 'trains')
    expect(trainsDiv.children).toHaveLength(1)
    expect(trainsDiv.children[0].textContent).toBe('2608 mot  avg Ke  07:14')
})
