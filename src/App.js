import React, {Component} from 'react';
import format from 'date-fns/format'
import Trains from './Trains'
import * as stations from './stations'
import './App.css';

class Buttons extends Component {
    render() {
        return <div>
            <button onClick={this.props.onNorth} style={{fontSize: '24px'}}>norrut</button>
            <button onClick={this.props.onSouth} style={{fontSize: '24px'}}>söderut</button>
        </div>
    }
}

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
            c.setState({stations: JSON.parse(this.response).RESPONSE.RESULT[0].TrainStation})
            stations.set(JSON.parse(this.response).RESPONSE.RESULT[0].TrainStation);
        }

        xhr.open('GET', '/json/stations', true)
        xhr.send()
    }

    render() {
        return (
            <div className="App">
                <Buttons onSouth={this.getCurrent('s')} onNorth={this.getCurrent('n')}/>
                {this.state.result.INFO &&
                <div>
                    <h1>{format(this.state.result.INFO.LASTMODIFIED['@datetime'], 'H:mm:ss')}</h1>
                    <Trains result={this.state.result}/>
                </div>
                }
            </div>
        );
    }
}

export default App;
