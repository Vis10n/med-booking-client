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
        var {form_object} = this.props;
        // var {filterName, filterPhoneNum, filterDay, filterSession, filterStatus} = this.state;
        var elmAppointment = form_object.map((form_object, index) => {
            return <AppointmentItem 
                        key={form_object.id}
                        index={index} 
                        form_object={form_object}
                        onDelete={this.props.onDelete}
                        onDetail={this.props.onDetail}
                    />
        });

        return(
            <table className="table table-hover mt-15">
                <thead>
                    <tr>
                        <th className="text-center">STT</th>
                        <th className="text-center">Họ Tên</th>
                        <th className="text-center">Số đt</th>
                        <th className="text-center">Ngày</th>
                        <th className="text-center">Sesstion</th>
                        <th className="text-center">Status</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td></td>
                        <td>
                            <input 
                                type="text" 
                                className="form-control"
                                name="filterName" 
                                // value={filterName}
                                onChange={this.onChange}/>
                        </td>
                        <td>
                        <input 
                                type="text" 
                                className="form-control"
                                name="filterPhoneNum" 
                                // value={filterPhoneNum}
                                onChange={this.onChange}/>
                        </td>
                        <td>
                        <input 
                                type="text" 
                                className="form-control"
                                name="filterDay" 
                                // value={filterDay}
                                onChange={this.onChange}/>
                        </td>
                        <td>
                        <input 
                                type="text" 
                                className="form-control"
                                name="filterSession" 
                                // value={filterSession}
                                onChange={this.onChange}/>
                        </td>
                        <td>
                        <input 
                                type="text" 
                                className="form-control"
                                name="filterStatus" 
                                // value={filterStatus}
                                onChange={this.onChange}/>
                        </td>
                        <td></td>
                    </tr>
                    {elmAppointment}
                </tbody>
            </table>
        );
    }
}
export default AppointmentList;