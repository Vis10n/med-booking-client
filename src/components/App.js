import React, {Component} from 'react';
import { BrowserRouter, Switch, Route, Redirect} from 'react-router-dom';

import '../css/App.css';

import Home from './Home';
import Login from './Login';
import HomeAdmin from './Administrator/HomeAdmin';
import AppointmentDetail from './Administrator/AppointmentDetail';
import NewBooking from './NewBooking';
import StayBooking from './StayBooking';
import CancelBooking from './CancelBooking';
import HomeAppointmentSession from './Administrator/HomeAppointmentSession';
import AppointmentSessionDetail from './Administrator/AppointmentSessionDetail';
import AddAccount from './Administrator/AddAccount';
import AddNewDay from './Administrator/AddNewDay';
import CalendarManager from './Administrator/CalendarManager';
import CustomerResult from './CustomerResult';
import MultiBooking from './MultiBooking';
import OldCustomer from './OldCustomer';
import Kappa from './Administrator/Kappa';
const PrivateRoute = ({ component: Component, ...rest }) => (
    <Route {...rest} render={(props) => (
        localStorage.getItem('token') !== null
        ? <Component {...props} />
        : <Redirect to='/login' />
    )} />
)

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            token: '',
            domain: 'http://localhost:8080',
        }
    }

    componentWillMount() {
        if (localStorage.getItem('token') !== null) {
            this.setState({
                token: localStorage.getItem('token'),
            })
        }
    }

    render() {

        var dashboard;
        if (localStorage.getItem('token') !== null) {
            dashboard = <a href="/HomeAdmin" className="navbar-brand">
                            <span>Med </span>
                            .Booking
                        </a>
        } else {
            dashboard = <a href="/" className="navbar-brand">
                            <span>Med </span>
                            .Booking
                        </a>
        }

        return (
            <div className="App">
                <div>
                    {/* nav */}
                    <nav className="navbar navbar-custom navbar-fixed-top">
                        <div className="container-fluid">
                            <div className="navbar-header">
                                <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#sidebar-collapse"><span className="sr-only">Toggle navigation</span>
                                    <span className="icon-bar"></span>
                                    <span className="icon-bar"></span>
                                    <span className="icon-bar"></span></button>
                                    {dashboard}
                            </div>
                            {/* /.container-fluid  */}
                        </div>
                        {/* /.nav */}
                    </nav>
                </div>
                <div>
                    {/* main */}                
                    <BrowserRouter>
                        <Switch>
                            {/* Public */}
                            <Route 
                                exact path='/' 
                                component={Home} />   
                            <Route 
                                exact path='/MultiBooking' 
                                component={MultiBooking} /> 
                            <Route 
                                exact path='/OldCustomer' 
                                component={OldCustomer} />                   
                            <Route 
                                path='/Login' 
                                component={Login} />
                            <Route 
                                path='/NewBooking' 
                                component={NewBooking} />
                            <Route 
                                path='/StayBooking' 
                                component={StayBooking} />
                            <Route 
                                path='/CustomerResult' 
                                component={CustomerResult} />
                            <Route 
                                path='/CancelBooking' 
                                render={props => <CancelBooking {...props} token={this.state.token} />} />
                            {/* For Administrator only*/}
                            <Route 
                                path='/AppointmentDetail' 
                                component={AppointmentDetail} />
                            <PrivateRoute 
                                path='/HomeAdmin' 
                                component={HomeAdmin} />
                            <PrivateRoute 
                                path='/HomeAppointmentSession' 
                                component={HomeAppointmentSession} />
                            <PrivateRoute 
                                path='/AppointmentSessionDetail' 
                                component={AppointmentSessionDetail} />
                            <PrivateRoute 
                                path='/AddAccount' 
                                component={AddAccount} />   
                            <PrivateRoute 
                                path='/AddNewDay' 
                                component={AddNewDay} />   
                            <PrivateRoute 
                                path='/CalendarManager' 
                                component={CalendarManager} />
                            <Route 
                                path='/Kappa' 
                                component={Kappa} />

                        </Switch>
                    </BrowserRouter>
                    {/* /.main */}
                </div>
                <div className="footer">
                    <footer >

                    </footer>
                </div>
            </div>
        );
    }
}
export default App;