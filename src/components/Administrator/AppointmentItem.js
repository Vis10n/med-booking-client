import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import '../../css/App.css';

class AppointmentItem extends Component {
    constructor(props) {
        super(props);
        this.state = {
            token: localStorage.getItem('token'),
            domain: 'http://localhost:8080',
            id:this.props.form_object.id,
            name: this.props.form_object.name,
            phoneNumber: this.props.form_object.phoneNumber,
            day: this.props.form_object.day,
            status: this.props.form_object.status,
            session: this.props.form_object.session,
        }
    }

    onDetail = () => {
        localStorage.setItem("appointmentId",this.state.id);
        
    }

    render() {
        var {form_object, index} = this.props;
        console.log(form_object)
        return(
            // bắt sự kiện Edit khi click vào từng dòng trong bảng
            <tr>    
                {/* Số thứ tự */}
                <td style={{width:"5%"}}>{form_object.id}</td>

                {/* Tên */}
                <td style={{width:"21%"}}>{form_object.name}</td>

                {/* Số điện thoại */}
                <td style={{width:"20%"}}>{form_object.phoneNumber}</td>

                {/* Ngày */}
                <td style={{width:"20%"}}>{form_object.day}</td>

                {/* Status */}
                <td style={{width:"13%"}}>{form_object.session}</td>

                {/* Session */}
                <td style={{width:"13%"}}>{form_object.status}</td>
                
                <td style={{width:"13%"}}>{form_object.type}</td>
                {/* Các button chức năng */}
                <td className="text-center">
                    <Link to='/AppointmentDetail'>
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