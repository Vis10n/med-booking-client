import React, {Component} from 'react';
import '../../css/App.css';

import AppointmentSessionItem from './AppointmentSessionItem'

class AppointmentSessionList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            filterName: '',
            filterPhoneNum: '',
            filterDay: '',
            filterSession: '',
            filterStatus: '',
        }
    }

    // onChange = (event) => {
    //     var target = event.target;
    //     var name = target.name;
    //     var value = target.value;
    //     this.props.onFilter(
    //         name === 'filterName' ? value : this.state.filterName,
    //         name === 'filterPhoneNum' ? value : this.state.filterPhoneNum,
    //         name === 'filterDay' ? value : this.state.filterDay,
    //         name === 'filterSession' ? value : this.state.filterSession,
    //         name === 'filterStatus' ? value : this.state.filterStatus,
    //     )
    //     this.setState({
    //         [name]: value
    //     });
    // }

    render() {
        var {day_object} = this.props;
        // var {filterName, filterPhoneNum, filterDay, filterSession, filterStatus} = this.state;
        var elmAppointment = day_object.map((day_object, index) => {
            return <AppointmentSessionItem 
                        key={day_object.id}
                        index={index} 
                        day_object={day_object}
                        onDetail={this.props.onDetail}
                    />
        });

        return(
            <table className="table table-hover mt-15">
               <tbody>
                    {elmAppointment}
                </tbody>
            </table>
        );
    }
}
export default AppointmentSessionList;