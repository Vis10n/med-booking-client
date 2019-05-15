import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import axios from 'axios';
import Calendar from 'react-calendar';
import '../../css/App.css';


import moment from "moment";
class CalendarManager extends Component {
    constructor(props) {
        super(props);
        this.state = {
            token: localStorage.getItem('token'),
            domain: 'http://localhost:8080',
            day_object: [],
            day: "",
            morningCase: 0,
            afternoonCase: 0,
            morningMaxCase: 0,
            afternoonMaxCase: 0, 
        }
    }


    componentWillMount() {
     
    }

    onChangeInput = (event) => {
        var target = event.target;
        var name = target.name;
        var value = target.value;

        this.setState({
            [name]: value
        })
        console.log(name + " - " + value);
    }
    
    focus =(value)=>{
        
        // var date = new Intl.DateTimeFormat('en-US', {year: 'numeric', month: '2-digit',day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit'}).format(value)
        // var date2 = dateFormat(value, "yyyy-mm-dd")
        var day = new Intl.DateTimeFormat('en-US', {day: '2-digit'}).format(value)
        var month = new Intl.DateTimeFormat('en-US', {month: '2-digit'}).format(value)
        var year = new Intl.DateTimeFormat('en-US', {year: 'numeric'}).format(value)
        var date = year+"-"+month+"-"+day
        this.setState({day:date})
        var body_data={
            day:date
        }
        axios
            .post(
                this.state.domain + "/admin/get_day_detail",
                body_data,
                {
                    headers: { 
                        "Authorization": this.state.token,
                        "content-type": "application/json", }
                }
            )
            .then(response => {
                this.setState({
                    morningCase:response.data.morningCase,
                    afternoonCase:response.data.afternoonCase,
                    afternoonMaxCase:response.data.afternoonMaxCase,
                    morningMaxCase:response.data.morningMaxCase
                })
                // console.log(response.data);
                // this.data = response.data.list;
            })
            .catch(function (error) {
                console.log(error);
            });
        console.log(date);
    }
    onSubmit = (event) => {
        //chặn submit lên url
        event.preventDefault();
        var day = {
            id:"",
            day: this.state.day,
            morningCase: this.state.morningCase,
            afternoonCase: this.state.afternoonCase,
            morningMaxCase: this.state.morningMaxCase,
            afternoonMaxCase: this.state.afternoonMaxCase,

        }
        axios
            .post(
                this.state.domain + "/admin/config_schedule",
                {day},
                {
                    headers: { 
                        "Authorization": this.state.token,
                        "content-type": "application/json", }
                }
            )
            .then(response => {
                if (response.data.status === "good") {
                    alert("Thao tác thành công!");
                } else if(response.data.status==="not allowed to change"){
                    alert("Ngày đã có lịch hẹn không được thay đổi");
                } else{
                    alert("Lỗi!")
                }
                //console.log(response);
            })
            .catch(function (error) {
                console.log(error);
            });
    }
    // xóa token và đăng xuất
    signOut = () => {
        // console.log(localStorage.getItem("token"));
        localStorage.removeItem("token");
    }
  
    render() {
        // Lấy day_object từ state để sử dụng
        var {day, morningCase, afternoonCase, morningMaxCase, afternoonMaxCase} = this.state;
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

        // render Jsx
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
                    <li>
                        <Link to="/CancelBooking">
                            <em className="fa fa-dashboard">
                                &nbsp;
                            </em>
                            Hủy lịch khám
                        </Link>
                    </li>
                    <li className="active">
                        <Link to="/CalendarManager">
                            <em className="fa fa-dashboard">
                                &nbsp;
                            </em>
                            Quản lý phiên
                        </Link>
                    </li>
                    <li>
                        <Link to="/AddAccount">
                            <em className="fa fa-dashboard">
                                &nbsp;
                            </em>
                            Tạo tài khoản
                        </Link>
                    </li>
                    <li>
                        <Link to="/" onClick={this.signOut}>
                            <em className="fa fa-dashboard">
                                &nbsp;
                            </em>
                            Đăng xuất
                        </Link>
                    </li>
                </ul>
                {/* /.sidebar */}             
            </div>

            <div className="col-sm-9 col-sm-offset-3 col-lg-10 col-lg-offset-2 main">
                {/* /.main */}
                <div className="row mt-60">
                    <ol className="breadcrumb">
                        <li>
                            <em className="fa fa-home"></em>
                        </li>
                        <li className="active">Dashboard</li>
                        <li className="active">Admin</li>
                        <li className="active">Quản lý phiên</li>
                    </ol>
                </div>

                <h1>
                    Danh sách phiên làm việc               
                </h1>
                <div className="col-md-5" >
                    
                    <Calendar
                        onChange={this.onChange}
                        onClickDay={this.focus}
                        value={this.state.date}
                        />

                </div>
                <div className="col-md-6" >
                <form onSubmit={this.onSubmit}>        
                    <div className="row">
                        <div className="col-sm-4"> <label > Số ca sáng : </label> </div>
                        <div className="col-sm-6"> 
                        <input
                            type="text"
                            name="morningCase"
                            className="form-control"
                            value={morningCase}
                            disabled={true}
                            onChange={this.onChangeInput} />
                        </div>
                    </div>
                    <br></br>
                    <div className="row">
                        <div className="col-sm-4"> <label > Số ca chiều : </label> </div>
                        <div className="col-sm-6"> 
                        <input
                            type="text"
                            name="afternoonCase"
                            className="form-control"
                            value={afternoonCase}
                            disabled={true}
                            onChange={this.onChangeInput} />
                        </div>
                    </div>
                    <br></br>
                    <div className="row">
                        <div className="col-sm-4"> <label > Giới hạn ca sáng : </label> </div>
                        <div className="col-sm-6">
                        <input
                            type="text"
                            name="morningMaxCase"
                            className="form-control"
                            value={morningMaxCase}
                            onChange={this.onChangeInput} />
                        </div>
                    </div>
                    <br></br>
                    <div className="row">
                        <div className="col-sm-4"> <label > Giới hạn ca chiều : </label> </div>
                        <div className="col-sm-6">
                        <input
                            type="text"
                            name="afternoonMaxCase"
                            className="form-control"
                            value={afternoonMaxCase}
                            onChange={this.onChangeInput} />
                        </div>
                    </div>
                    <br></br>
                    <div className="row">
                        <div className="col-sm-5">
                        </div>
                        <div className="col-sm-2">
                            <button
                                type="submit"
                                className="btn btn-primary ml-50p mb-5"
                                // disabled={
                                //     !this.state.morningMaxCase
                                //     ||  !this.state.afternoonMaxCase}
                                >
                                <span className="fa fa-check mr-5"></span>
                                Hoàn tất
                            </button>
                        </div>

                        <div className="col-sm-3">
                            
                        </div>
                    </div>
                </form>
                </div>
                
                <br/>
                {/* data tables */}
                
                {/* /.main */}
            </div>
        </div>        
        );
    }
}
export default CalendarManager;