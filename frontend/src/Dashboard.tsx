import React, { Component } from 'react';
import axios from 'axios';
import { getDateFromEpoch, getEpochFromDate } from './Utils';
import { Line, Doughnut } from 'react-chartjs-2';

interface Stats {
    reading__avg: number,
    reading__max: number,
    reading__min: number
}

interface IState {
    sensorType: string,
    from: string,
    to: string,
    dataList: Array<any>,
    dataLoaded: boolean,
    showGraph: boolean,
    showStats: boolean,
    stats: Stats
}

export default class Dashboard extends Component<{}, IState> {
    constructor(props: {}) {
        super(props)

        let date = new Date();

        this.state = {
            dataList: [],
            dataLoaded: false,
            sensorType: "temperature",
            to: date.toISOString(),
            from: `${date.getMonth()}-${date.getDate() - 1}-${date.getFullYear()}`,
            showGraph: false,
            showStats: false,
            stats: { reading__max: 0, reading__min: 0, reading__avg: 0 }
        }
    }

    configRadarDate = () => {
        const { stats } = this.state;
        let dataLabels = ['Mean', 'Min', 'Max']
        let dataPoints = [stats.reading__avg, stats.reading__min, stats.reading__max]
        return {
            labels: dataLabels,
            datasets: [
                {
                    label: 'Stats',
                    backgroundColor: [
                        '#FF6384',
                        '#36A2EB',
                        '#FFCE56'
                    ],
                    hoverBackgroundColor: [
                        '#FF6384',
                        '#36A2EB',
                        '#FFCE56'
                    ],
                    data: dataPoints
                }
            ]
        }
    }

    configChartData = () => {
        const { dataLoaded, dataList } = this.state;

        if (dataList.length === 0) return;

        var dataLabels: Array<string> = [];
        var dataPoints: Array<number> = [];

        dataList.forEach(item => {
            dataLabels.push(getDateFromEpoch(item.timestamp));
            dataPoints.push(item.reading);
        });

        return {
            labels: dataLabels,
            datasets: [
                {
                    label: dataList[0].sensor_type,
                    fill: false,
                    lineTension: 0.1,
                    backgroundColor: 'rgba(75,192,192,0.4)',
                    borderColor: 'rgba(75,192,192,1)',
                    borderCapStyle: 'butt',
                    borderDash: [],
                    borderDashOffset: 0.0,
                    borderJoinStyle: 'miter',
                    pointBorderColor: 'rgba(75,192,192,1)',
                    pointBackgroundColor: '#fff',
                    pointBorderWidth: 1,
                    pointHoverRadius: 5,
                    pointHoverBackgroundColor: 'rgba(75,192,192,1)',
                    pointHoverBorderColor: 'rgba(220,220,220,1)',
                    pointHoverBorderWidth: 2,
                    pointRadius: 1,
                    pointHitRadius: 10,
                    data: dataPoints
                }
            ]
        }
    }

    getAll = () => {
        let url = `http://localhost:8001/api/get_all`
        axios.get(url)
            .then(res => {
                // console.log(res.data);
                this.setState({
                    dataLoaded: true,
                    dataList: res.data,
                });
            })
            .catch(error => {
                console.error(error);
            });
    }

    getRangeData = () => {
        const { from, to, sensorType } = this.state;
        let url = `http://localhost:8001/api/range?sensor=${sensorType}&from=${getEpochFromDate(from)}&to=${getEpochFromDate(to)}`
        axios.get(url)
            .then(res => {
                // console.log(res.data);
                this.setState({
                    dataLoaded: true,
                    dataList: res.data,
                });
            })
            .catch(error => {
                console.error(error);
            });
    }

    getStats = (e: React.ChangeEvent<HTMLInputElement>) => {

        this.setState({ showStats: e.target.checked });

        const { from, to, sensorType } = this.state;

        let url = `http://localhost:8001/api/stats?sensor=${sensorType}&from=${getEpochFromDate(from)}&to=${getEpochFromDate(to)}`
        axios.get(url)
            .then(res => {
                // console.log(res.data);
                this.setState({
                    dataLoaded: true,
                    stats: res.data,
                });
            })
            .catch(error => {
                console.error(error);
            });
    }

    componentDidMount() {
        this.getRangeData();
    }

    handleSubmit = (e: React.FormEvent<HTMLElement>) => {
        e.preventDefault();
        this.getRangeData();
    }

    render() {
        return (
            <div className="container container-fluid p-1">
                <h3 className="display-4 pb-5">Atria Power</h3>
                <div className="card flex-fill">
                    <div className="card-header">
                        <div className="row">
                            <div className="col-10">
                                <form className="form-inline" onSubmit={this.handleSubmit}>
                                    <div className="form-group p-2">
                                        <label htmlFor="inputLastName">Sensor</label>
                                        <select id="inputBG" className="form-control"
                                            value={this.state.sensorType} onChange={(e) => { this.setState({ sensorType: e.target.value }) }}
                                            required
                                        >
                                            <option value="" disabled></option>
                                            <option value="temperature">Temperature</option>
                                            <option value="humidity">Humidity</option>
                                            <option value="lumen">Lumen</option>
                                        </select>
                                    </div>
                                    <div className="form-group p-2">
                                        <label htmlFor="staticEmail2">From</label>
                                        <input type="datetime-local" className="form-control"
                                            value={this.state.from} onChange={(e) => { this.setState({ from: e.target.value }) }}
                                            required
                                        />
                                    </div>
                                    <div className="form-group p-2">
                                        <label htmlFor="inputPassword2">To</label>
                                        <input type="datetime-local" className="form-control"
                                            value={this.state.to} onChange={(e) => { this.setState({ to: e.target.value }) }}
                                            required
                                        />
                                    </div>
                                    <div className="form-group p-2">
                                        <button type="submit" className="btn btn-primary p-1">Search</button>
                                    </div>
                                </form>
                            </div>
                            {!this.state.showStats ? <div className="col-1">
                                <div className="custom-control custom-switch p-2 mt-2">
                                    <input type="checkbox" className="custom-control-input" id="customSwitch1"
                                        checked={this.state.showGraph} onChange={(e) => { this.setState({ showGraph: e.target.checked }) }}
                                    />
                                    <label className="custom-control-label" htmlFor="customSwitch1">Graph</label>
                                </div>
                            </div> : null}
                            <div className="col-1">
                                <div className="custom-control custom-switch p-2 mt-2">
                                    <input type="checkbox" className="custom-control-input" id="customSwitch2"
                                        checked={this.state.showStats} onChange={this.getStats}
                                    />
                                    <label className="custom-control-label" htmlFor="customSwitch2">Stats</label>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="card-body">
                        <div className="align-self-center chart chart-lg">
                            {this.state.showStats ?
                                <Doughnut data={
                                    this.configRadarDate()
                                } /> :
                                !this.state.showGraph ?
                                    <table className="table table-striped table-dark">
                                        <thead>
                                            <tr>
                                                <th scope="col">Sensor</th>
                                                <th scope="col">Reading</th>
                                                <th scope="col">Timestamp</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {this.state.dataLoaded ? this.state.dataList.map((item, key) => {
                                                return <tr key={key} className="data">
                                                    <td>{item.sensor_type}</td>
                                                    <td>{item.reading}</td>
                                                    <td>{getDateFromEpoch(item.timestamp)}</td>
                                                </tr>
                                            }) : null}
                                        </tbody>
                                    </table>
                                    : <Line data={
                                        this.configChartData()
                                    }></Line>
                            }
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
