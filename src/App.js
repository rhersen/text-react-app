import React, { Component } from 'react'
import format from 'date-fns/format'
import keyby from 'lodash.keyby'

import * as grid from './grid'
import Trains from './Trains'

import './App.css'

class App extends Component {
  constructor(props) {
    super(props)
    this.state = { stations: [], result: {} }
  }

  componentDidMount() {
    const xhr = new XMLHttpRequest()
    xhr.onload = () =>
      this.setState({
        stations: keyby(JSON.parse(xhr.response), 'LocationSignature'),
      })

    xhr.open('GET', 'http://backend.hersen.net/json/pendel', true)
    xhr.send()
  }

  getCurrent(direction) {
    return () => {
      const xhr = new XMLHttpRequest()
      this.setState({
        clicked: direction,
        loaded: undefined,
      })
      xhr.onload = () => {
        if (xhr.status === 200) {
          this.setState({
            result: JSON.parse(xhr.response).RESPONSE.RESULT[0],
            loaded: direction,
            clicked: undefined,
          })
        }
      }

      xhr.open(
        'GET',
        `http://backend.hersen.net/json/current?direction=${direction}`,
        true
      )
      xhr.send()
    }
  }

  render() {
    return (
      <svg viewBox="-4 -6 8 12">
        <polygon
          className={
            this.state.loaded === 'n'
              ? 'loaded'
              : this.state.clicked === 'n'
                ? 'clicked'
                : 'idle'
          }
          points={grid.leftTriangle()}
          stroke="#005CFF"
          fill="#f5f5f5"
          onClick={this.getCurrent('n')}
        />
        <polygon
          className={
            this.state.loaded === 's'
              ? 'loaded'
              : this.state.clicked === 's'
                ? 'clicked'
                : 'idle'
          }
          points={grid.rightTriangle()}
          stroke="#005CFF"
          fill="#f5f5f5"
          onClick={this.getCurrent('s')}
        />
        {this.state.result.INFO && (
          <g>
            <text className="timestamp" textAnchor="middle" x="-1.5" y="-0.5">
              {format(
                this.state.result.INFO.LASTMODIFIED['@datetime'],
                'H:mm:ss'
              )}
            </text>
            <Trains result={this.state.result} stations={this.state.stations} />
          </g>
        )}
      </svg>
    )
  }
}

export default App
