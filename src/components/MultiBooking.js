import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import axios from "axios";

import '../css/App.css';

class MultiBooking extends Component {
    
    //Hàm khởi tạo
    constructor(props) {
        super(props);
        this.state = {
            domain: 'http://localhost:8080',
            id: '',
            name: '',
            phoneNumber: '',
            day: '',
            session:'',
            status: 'waiting',
            number:'',
            morningFreeCase:0,
            afternoonFreeCase:0,
            day_object: [],
            isdisable:false
        }
    }

    getAPICheckAvailableCase = () => {
        axios
            .get(
                this.state.domain + "/check_available_case",
                {},
                {
                    headers: { "content-type": "application/json" }
                }
            )
            .then(response => {
                this.setState({
                    day_object: response.data              
                })
                // console.log(this.state.day_object);
            })
            
    }

    componentWillMount() {
        this.getAPICheckAvailableCase();
        this.setState({
            stay: false,
        })
    }

    //TODO Bắt sự kiện thay đổi trường input
    onChange = (event) => {
        var target = event.target;
        var name = target.name;
        var value = target.value;  
        if (name === 'stay') {
            target.value === "true" ? value = true : value = false;
        }     
        this.setState({
            [name]: value
        })

        if(name ==='day'){
            console.log(value)
            axios
            .post(
                this.state.domain + "/get_day_detail",
                {day:value},
                {
                    headers: { "content-type": "application/json", }
                }
            )
            .then(response => {
                console.log(response)
                var morningfree;
                var afternoonFree;
                morningfree =  response.data.morningMaxCase  - response.data.morningCase
                afternoonFree = response.data.afternoonMaxCase - response.data.afternoonCase
                this.setState({
                    morningFreeCase:morningfree,
                    afternoonFreeCase:afternoonFree
                })
            })
            .catch(function (error) {
                console.log(error);
            });
        }
    }

    onClearForm = () => {
        this.setState({
            id: '',
            name: '',
            phoneNumber: '',
            day: '',
            session:'morning',
            status: 'waiting',
            number:'',
            // stayCheck: false,
            day_object: [],
        })
    }


    onSubmit = (event) => {
        //chặn submit lên url
        this.setState({
            isdisabled:true
        })
        event.preventDefault();
        if(this.state.phoneNumber.length<10||this.state.phoneNumber.length>11){
            alert("số điện thoại không phù hợp")
            this.setState({
                isdisabled:false
            })
        }else{
           
            var wrapper=  {
                id: '',
                name: this.state.name,
                phoneNumber: this.state.phoneNumber,
                day: this.state.day,
                number:this.state.number,
                session:this.state.session
            }
            axios
                .post(
                    this.state.domain + "/multi_booking",
                    wrapper,
                    {
                        headers: { "content-type": "application/json", }
                    }
                )
                .then(response => {
                    if (response.data.status === "good") {
                        alert("đặt thành công buổi hẹn! Mã xác thực là " + response.data.code);
                        this.onClearForm();
                        this.setState({
                            isdisabled:false
                        })
                    } else if(response.data.status === "overload"){
                        alert("Phiên không đủ ca để đăng ký, xin chọn lại ngày khác, xin cảm ơn !")
                        this.setState({
                            isdisabled:false
                        })
                    }else if(response.data.status === "old day"){
                        alert("Ngày không khả dụng")
                        this.setState({
                            isdisabled:false
                        })
                    }
                    else {
                        alert("Lỗi!");
                        this.setState({
                            isdisabled:false
                        })
                    }
                })
                .catch(function (error) {
                    console.log(error);
                });
        }
    }


    // xóa token và đăng xuất
    signOut = () => {
        // console.log(localStorage.getItem("token"));
        localStorage.removeItem("token");
    }

    render() {
        var {day_object} = this.state;
        var availableDay = day_object.map((day_object, index) => {
            return <option 
                key={day_object.id} 
                index={index} 
                value={day_object.day}>
                    {day_object.day}
                </option>
        });

        //Điều hướng trang chủ private/public
        var dashboard;
        if (localStorage.getItem('token') !== null) {
            dashboard = <Link to="/HomeAdmin">
                            <em className="fa fa-dashboard">
                                &nbsp;
                            </em>
                            Trang chủ
                        </Link>
        } else {
            dashboard = <Link to="/">
                            <em className="fa fa-dashboard">
                                &nbsp;
                            </em>
                            Trang chủ
                        </Link>
        }

        var homeAppointmentSession;
        if (localStorage.getItem('token') !== null) {
            homeAppointmentSession = 
                        <Link to="/CalendarManager">
                            <em className="fa fa-dashboard">
                                &nbsp;
                            </em>
                            Quản lý phiên
                        </Link>
        } else {
            homeAppointmentSession = null;
        }
        var customerResult;
        if(localStorage.getItem('token') === null){
            customerResult = 
                            <Link to="/CustomerResult">
                                <em className="fa fa-dashboard">
                                    &nbsp;
                                </em>
                                Tra cứu kết quả khám
                            </Link>
                           
        } else {
            customerResult = null;
        }
        //hiển thị login/logout theo trạng thái hiện tại
        var logInOutButton;
        if (localStorage.getItem('token') !== null) {
            logInOutButton = <Link to="/" onClick={this.signOut}>
                                <em className="fa fa-dashboard">
                                    &nbsp;
                                </em>
                                Đăng xuất
                            </Link>
        } else {
            logInOutButton = <Link to="/Login" >
                                <em className="fa fa-dashboard">
                                    &nbsp;
                                </em>
                                Đăng nhập (Admin only)
                            </Link>
        }
         
        var addAccount; 
        if (localStorage.getItem('token') !== null) {
            addAccount = 
                        <Link to="/AddAccount">
                            <em className="fa fa-dashboard">
                                &nbsp;
                            </em>
                            Tạo tài khoản
                        </Link>
        } else {
            addAccount = null;
        }
        
        return(
            <div>
                {/* sidebar */}
                <div id="sidebar-collapse" className="col-sm-3 col-lg-2 sidebar">
                    <div className="divider"></div>
                    <ul className="nav menu">
                        <li>
                            {dashboard}
                        </li>
                        <li >
                            <Link to="/NewBooking">
                                <em className="fa fa-dashboard">
                                    &nbsp;
                                </em>
                                Đặt lịch khám
                            </Link>
                        </li>
                        <li className="active">
                            <Link to="/MultiBooking" >
                                <em className="fa fa-dashboard">
                                    &nbsp;
                                </em>
                                Đăng ký tập thể
                            </Link>
                        </li>
                        <li>
                            <Link to="/StayBooking">
                                <em className="fa fa-dashboard">
                                    &nbsp;
                                </em>
                                Đăng ký nội trú
                            </Link>
                        </li>
                        <li>
                            <Link to="/OldCustomer">
                                <em className="fa fa-dashboard">
                                    &nbsp;
                                </em>
                                Đăng ký cũ
                            </Link>
                        </li>
                        <li>
                            <Link to="/CancelBooking">
                                <em className="fa fa-dashboard">
                                    &nbsp;
                                </em>
                                Hủy lịch khám
                            </Link>
                        </li>
                        <li>
                            {customerResult}
                        </li>
                        <li>
                            {homeAppointmentSession}
                        </li>
                        <li>
                            {addAccount}
                        </li>
                        <li>
                            {logInOutButton}
                        </li>
                    </ul>
                    {/* /.sidebar */}             
                </div>

                <div className="col-sm-9 col-sm-offset-3 col-lg-10 col-lg-offset-2 main">
                    {/* /.main */}
                    <div className="mt-60 row">
                        <ol className="breadcrumb">
                            <li>
                                <em className="fa fa-home"></em>
                            </li>
                            <li>Dashboard</li>
                            <li className="active">Đặt lịch</li>
                        </ol>
                    </div>
                    <div>
                        <h1>
                            Đăng ký tập thể
                        </h1>
                        <div className="panel panel-info col-xs-13 col-sm-13 col-md-13 col-lg-13">
                            <div className="panel-heading">
                                <h3 className="panel-title">
                                    Đặt lịch khám bệnh tập thể
                                    &nbsp;
                                </h3>
                            </div>
                            <div className="panel-body">
                                <form onSubmit={this.onSubmit}>
                                    <div className="col-md-6">                                  
                                        {/* Họ Tên (input) */}
                                        <div className="form-group">
                                            <label>Họ và tên <font color="red">*</font> </label>
                                            <input
                                                type="text"
                                                name="name"
                                                className="form-control"
                                                id=""
                                                placeholder="họ và tên của bạn"
                                                value={this.state.name}
                                                onChange={this.onChange} />
                                        </div>
                                        <div className="form-group">
                                            <label>Ngày <font color="red">*</font> </label>
                                            <input
                                                type="date"
                                                className="form-control"
                                                name="day"
                                                value={this.state.day}
                                                onChange={this.onChange}/>
                                               
                                        </div>
                                        <div className="form-group">
                                            <label>Địa chỉ <font color="red">*</font> </label>
                                            <input
                                                type="text"
                                                name="address"
                                                className="form-control"
                                                id=""
                                                placeholder="địa chỉ của bạn"
                                                value={this.state.address}
                                                onChange={this.onChange} />
                                        </div>
                                        <div className="form-group">
                                            <label>Số lượng <font color="red">*</font> </label>
                                            <input
                                                type="text"
                                                name="number"
                                                className="form-control"
                                                id=""
                                                placeholder=""
                                                value={this.state.number}
                                                onChange={this.onChange} />
                                        </div>
                                        {/* Thời gian (input) */}
                                        
                                    </div>
                                    <div className="col-md-6">
                                        {/* Số điện thoại (input) */}
                                        <div className="form-group">
                                            <label>Số điện thoại <font color="red">*</font></label>
                                            <input
                                                type="text"
                                                name="phoneNumber"
                                                className="form-control"
                                                id=""
                                                placeholder="số điện thoại"
                                                value={this.state.phoneNumber}
                                                onChange={this.onChange} />
                                        </div>

                                        {/* Session (select) */}
                                        <div className="form-group">
                                            <label>Số buổi sáng còn trống : </label>
                                            <input
                                                type="text"
                                                name="morningFreeCase"
                                                className="form-control"
                                                disabled={true}
                                                value={this.state.morningFreeCase}
                                                />
                                        </div>
                                        <div className="form-group">
                                            <label>Số buổi chiều còn trống : </label>
                                            <input
                                                type="text"
                                                name="afternoonFreeCase"
                                                className="form-control"
                                                disabled={true}
                                                value={this.state.afternoonFreeCase}
                                                />
                                        </div>
                                        <div className="form-group">
                                            <label>Phiên <font color="red">*</font></label>
                                            <select
                                                className="form-control"
                                                name="session"
                                                value={this.state.session}
                                                onChange={this.onChange}>
                                                <option value="morning">Buổi sáng</option>
                                                <option value="afternoon">Buổi chiều</option>
                                            </select>
                                        </div>
                                    </div>
                                    
                                    

                                    <div className="col-md-12">
                                    <button
                                            type="submit"
                                            className="btn btn-primary"
                                            disabled={!this.state.name
                                                || !this.state.phoneNumber
                                                || !this.state.day
                                                || !this.state.address
                                                // || !this.state.session
                                                || this.state.isdisable
                                                }
                                            >
                                            <span className="fa fa-check mr-5"></span>
                                            Xác nhận
                                        </button>
                                        &nbsp;
                                        {/* <button 
                                            type="button" 
                                            className="btn btn-warning"
                                            onClick={this.onClearForm}>
                                            Đặt lại
                                        </button> */}
                                    </div>                        
                                        
                                </form>
                            </div>
                        </div>

                    </div>

                    {/* /.main */}
                </div>
            </div>
        );
    }
}
export default MultiBooking;