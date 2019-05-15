import React, {Component} from 'react';
import '../../css/App.css';

import AppointmentItem from './AppointmentItem'

class AppointmentList extends Component {
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
    getFilter=()=>{
        alert(this.state.filterDay)
    }
    onChange = (event) => {
        var target = event.target;
        var name = target.name;
        var value = target.value;
        this.setState({
            [name]: value
        });
    }

    render() {
        var {form_object} = this.props;
        // var {filterName, filterPhoneNum, filterDay, filterSession, filterStatus} = this.state;
        var elmAppointment = form_object.map((form_object, index) => {
            return <AppointmentItem 
                        key={form_object.id}
                        index={index} 
                        form_object={form_object}
                        onDetail={this.props.onDetail}
                    />
        });

        return(
            <table className="table table-hover mt-15">
                <thead className="d-none">
                    {/* <tr>
                        <th className="text-center">STT</th>
                        <th className="text-center">Họ Tên</th>
                        <th className="text-center">Số đt</th>
                        <th className="text-center">Ngày</th>
                        <th className="text-center">Sesstion</th>
                        <th className="text-center">Status</th>
                    </tr> */}
                </thead>
                <tbody>
                    
                    {elmAppointment}
                </tbody>
            </table>
        );
    }
}
export default AppointmentList;