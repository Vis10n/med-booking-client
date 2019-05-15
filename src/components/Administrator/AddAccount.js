import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import axios from "axios";

import '../../css/App.css';

class CancelBooking extends Component {
    constructor(props) {
        super(props);
        this.state = {
            token: localStorage.getItem('token'),
            domain: 'http://localhost:8080',
            username: '',
            password: '',
            confirmPass: '',
            status: '',
            code: '',
        }
    }

    //TODO Bắt sự kiện thay đổi trường input
    onChange = (event) => {
        var target = event.target;
        var name = target.name;
        var value = target.value;

        this.setState({
            [name]: value
        })
    }

    onSubmit = (event) => {
        //chặn submit lên url
        event.preventDefault();
        // check xem xác nhận pass có giống pass không
        if (this.state.password === this.state.confirmPass) {
            axios
                .post(
                    this.state.domain + "/admin/add_account",
                    {
                        username: this.state.username,
                        password: this.state.password,
                    },
                    {
                        headers: { 
                            "Authorization": this.state.token,
                            "content-type": "application/json", }
                    }
                )
                .then(response => {
                    if (response.data.status === "good") {
                        alert("Tạo tài khoản thành công");
                    } else {
                        alert("Lỗi!");
                    }
                    //console.log(response);
                })
                .catch(function (error) {
                    console.log(error);
                });
        }
        else {
            alert("Mật khẩu không trùng khớp!")
        }
        
    }

    // xóa token và đăng xuất
    signOut = () => {
        // console.log(localStorage.getItem("token"));
        localStorage.removeItem("token");
    }
    
    render() {

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
        //Điều hướng quản lý phiên
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


        return(
            <div>
                {/* sidebar */}
                <div id="sidebar-collapse" className="col-sm-3 col-lg-2 sidebar">
                    <div className="divider"></div>
                    <ul className="nav menu">
                        <li>
                            {dashboard}
                        </li>
                        <li>
                            <Link to="/NewBooking">
                                <em className="fa fa-dashboard">
                                    &nbsp;
                                </em>
                                Đặt lịch khám
                            </Link>
                        </li>
                        <li>
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
                        <li >
                            <Link to="/CancelBooking">
                                <em className="fa fa-dashboard">
                                    &nbsp;
                                </em>
                                Hủy lịch khám
                            </Link>
                        </li>

                        <li>
                            {homeAppointmentSession}
                        </li>
                        <li className="active">
                            <Link to="/AddAccount">
                                <em className="fa fa-dashboard">
                                    &nbsp;
                                </em>
                                Tạo tài khoản
                            </Link>
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
                            <li className="active">Tạo tài khoản</li>
                        </ol>
                    </div>
                    <div>
                        <h1>
                            Tạo tài khoản mới
                        </h1>
                        <div className="panel panel-info col-xs-6 col-sm-6 col-md-6 col-lg-6">
                            <div className="panel-heading">
                                <h3 className="panel-title">
                                    Điền thông tin
                                    &nbsp;
                                </h3>
                            </div>
                            <div className="panel-body">
                                <form onSubmit={this.onSubmit}>                                   
                                        {/* Họ Tên (input) */}
                                        <div className="form-group">
                                            <label>Tên tài khoản</label>
                                            <input
                                                type="text"
                                                name="username"
                                                className="form-control"
                                                id=""
                                                placeholder="username"
                                                value={this.state.username}
                                                onChange={this.onChange} />
                                            <label>Mật khẩu</label>
                                            <input
                                                type="password"
                                                name="password"
                                                className="form-control"
                                                id=""
                                                placeholder="password"
                                                value={this.state.password}
                                                onChange={this.onChange} />
                                            <label>Nhập lại mật khẩu</label>
                                            <input
                                                type="password"
                                                name="confirmPass"
                                                className="form-control"
                                                id=""
                                                placeholder="nhập lại password"
                                                value={this.state.confirmPass}
                                                onChange={this.onChange} />
                                        </div>
                                        {/* Button hoàn tất  */}
                                        <button
                                            type="submit"
                                            className="btn btn-primary"
                                            disabled={!this.state.username
                                                ||  !this.state.password
                                                ||  !this.state.confirmPass}
                                        >
                                            <span className="fa fa-check mr-5"></span>
                                            Xác nhận
                                        </button>
                                        &nbsp;
                                        <Link to="/HomeAdmin">
                                            <button 
                                                type="button" 
                                                className="btn btn-warning">
                                                Huỷ
                                            </button>
                                        </Link>
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
export default CancelBooking;