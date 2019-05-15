import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import '../../css/App.css';

class AppointmentItem extends Component {
    constructor(props) {
        super(props);
        this.state = {
            token: localStorage.getItem('token'),
            domain: 'http://localhost:8080',
            id: this.props.day_object.id,
            day: this.props.day_object.day,
            morningCase: this.props.day_object.morningCase,
            afternoonCase: this.props.day_object.afternoonCase,
            morningMaxCase: this.props.day_object.morningMaxCase,
            afternoonMaxCase: this.props.day_object.afternoonMaxCase,
        }
    }

    onDetail = () => {
        localStorage.setItem("dayOjDay",this.state.day);
        localStorage.setItem("dayOjmorningCase",this.state.morningCase);
        localStorage.setItem("dayOjmorningMaxCase",this.state.morningMaxCase);
        localStorage.setItem("dayOjafternoonCase",this.state.afternoonCase);
        localStorage.setItem("dayOjafternoonMaxCase",this.state.afternoonMaxCase);
    }

    render() {
        var {id,day, morningCase, afternoonCase, morningMaxCase, afternoonMaxCase} = this.state;
     
        // console.log(day_object)
        return(
            // bắt sự kiện Edit khi click vào từng dòng trong bảng
            <tr>    
                {/* Số thứ tự */}
                <td style={{width:"8%"}}>{id}</td>

                {/* Tên */}
                <td style={{width:"25%"}}>{day}</td>

                {/* Số điện thoại */}
                <td style={{width:"20%"}}>{morningCase}</td>

                {/* Ngày */}
                <td style={{width:"20%"}}>{afternoonCase}</td>

                {/* Status */}
                <td style={{width:"20%"}}>{morningMaxCase}</td>

                {/* Session */}
                <td style={{width:"20%"}}>{afternoonMaxCase}</td>
                
                {/* Các button chức năng */}
                <td className="text-center">
                    <Link to='/AppointmentSessionDetail'>
                        <button 
                            type="button" 
                            className="btn btn-warning m-2"
                            onClick={this.onDetail}>
                            <span className="fa fa-pencil mr-5"></span>
                            Chi tiết
                        </button>
                    </Link>
                    
                    {/* <button 
                        type="button" 
                        className="btn btn-danger m-2"
                        onClick={this.onDelete}>
                        <span className="fa fa-trash mr-5"></span>
                        Xóa
                    </button> */}
                </td>
            </tr>
        );
    }
}
export default AppointmentItem;