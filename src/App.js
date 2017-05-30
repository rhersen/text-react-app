import React, {Component} from 'react';
import format from 'date-fns/format'
import keyby from 'lodash.keyby'
import Trains from './Trains'
import './App.css';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {stations: [], result: {}};
    }

    getCurrent(direction) {
        const self = this
        return () => {
            const xhr = new XMLHttpRequest()
            xhr.onload = function () {
                if (this.status === 200) {
                    self.setState({result: JSON.parse(this.response).RESPONSE.RESULT[0]});
                }
            }

            xhr.open('GET', `/json/current?direction=${direction}`, true)
            xhr.send()
        }
    }

    componentDidMount() {
        const xhr = new XMLHttpRequest()
        const c = this
        xhr.onload = function () {
            c.setState({stations: keyby(JSON.parse(this.response).RESPONSE.RESULT[0].TrainStation, 'LocationSignature')})
        }

        xhr.open('GET', '/json/stations', true)
        xhr.send()
    }

    render() {
        return (
            <svg viewBox="0 0 375 560">
                <polygon points="50,235 95,325 5,325" stroke="#005CFF" fill="#f5f5f5" onClick={this.getCurrent('n')}/>
                <polygon points="280,235 370,235 325,325" stroke="#005CFF" fill="#f5f5f5" onClick={this.getCurrent('s')}/>
                {/*<rect x="280" y="235" width="90" height="90" fill="green" onClick={this.getCurrent('s')}/>*/}
                {this.state.result.INFO &&
                <g>
                    <text x="0" y="220"
                          fill="#005CFF">{format(this.state.result.INFO.LASTMODIFIED['@datetime'], 'H:mm:ss')}</text>
                    <Trains result={this.state.result} stations={this.state.stations}/>
                </g>
                }
            </svg>
        );
    }
}

export default App;
