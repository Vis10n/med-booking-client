import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import axios from "axios";
import Pagination from "react-js-pagination";
// import ReactTable from 'react-table';
import AppointmentList from './AppointmentList';
// import { access } from 'fs';

class Kappa extends Component {
    constructor(props) {
        super(props);
        this.state = {
            token: localStorage.getItem('token'),
            domain: 'http://localhost:8080',
            form_object: [],
            data:[],
            sum_form: 0,
            morning_form: 0,
            afternoon_form: 0,
            canceled_form: 0,
            activePage: 1,
            TotalPage: 0,
            filterName: '',
            filterPhoneNum: '',
            filterDay: '',
            filterSession: '',
            filterStatus: '',
            filterType:''
        }
    }

    getAPICheckOneApointment = () => {
        axios
            .post(
                this.state.domain + "/admin/check_one_appointment",
                {
                    id: 1,
                },
                {
                    headers: { 
                        "Authorization": this.state.token,
                        "content-type": "application/json", }
                }
            )
            .then(response => {
                if (response.data.form_object !== null) {
                    this.setState({
                        form_object: response.data.form_object,
                    })
                } else {
                    alert("Lỗi!");
                }
                //console.log(response);
            })
            .catch(function (error) {
                console.log(error);
            });
        // localStorage.removeItem("appointmentId");
    }
    getFilter=()=>{
        var field = []
        var value = []
        if(this.state.filterName!==""){
            field.push('name')
            value.push(this.state.filterName)
        }
        if(this.state.filterPhoneNum!==""){
            field.push('phoneNumber')
            value.push(this.state.filterPhoneNum)
        }
        if(this.state.filterDay!==""){
            field.push('day')
            value.push(this.state.filterDay)
        }
        if(this.state.filterSession!==""){
            field.push('session')
            value.push(this.state.filterSession)
        }
        if(this.state.filterStatus!==""){
            field.push('status')
            value.push(this.state.filterStatus)
        }
        this.setState({
            activePage:1
        })
        var body_data={
            field:field,
            value:value,
            pageNumber:this.state.activePage,
            numberForm:'15'
        }
        // console.log(body_data)
        if(field.length>0){
            axios
            .post(
                this.state.domain + "/admin/form_filter",
                body_data,
                {
                    headers: { 
                        "Authorization": this.state.token,
                        "content-type": "application/json", }
                }
            )
            .then(response => {
                this.setState({
                    form_object: response.data.list,
                    TotalPage: response.data.numberPage
                    
                })
                // console.log(response.data);
                this.data = response.data.list;
            })
            .catch(function (error) {
                console.log(error);
            });
        }
        else{
            this.getAPICheckAllAppointment()
        }
    }
    onChange = (event) => {
        var target = event.target;
        var name = target.name;
        var value = target.value;
        this.setState({
            [name]: value
        });
    }
    getAPICheckAllAppointment = () => {
        var body_data=  {
            pageNumber: "1",
            numberOfForm: "15",
        }
        axios
            .post(
                this.state.domain + "/admin/check_all_appointment",
                body_data,
                {
                    headers: { 
                        "Authorization": this.state.token,
                        "content-type": "application/json", }
                }
            )
            .then(response => {
                this.setState({
                    form_object: response.data.list,
                    TotalPage: response.data.numberPage
                    
                })
                // console.log(response.data);
                this.data = response.data.list;
            })
            .catch(function (error) {
                console.log(error);
            });
    }


    componentWillMount() {
        this.getAPICheckAllAppointment();
        // this.getAPICheckOneApointment();
    }

    // xóa token và đăng xuất
    signOut = () => {
        // console.log(localStorage.getItem("token"));
        localStorage.removeItem("token");
    }
    //phân trang
    handlePageChange=(pageNumber)=>{
        // alert( pageNumber);
        // kiểm tra xem có đang lọc thông tin hay không
        var field = []
        var value = []
        if(this.state.filterName!==""){
            field.push('name')
            value.push(this.state.filterName)
        }
        if(this.state.filterPhoneNum!==""){
            field.push('phoneNumber')
            value.push(this.state.filterPhoneNum)
        }
        if(this.state.filterDay!==""){
            field.push('day')
            value.push(this.state.filterDay)
        }
        if(this.state.filterSession!==""){
            field.push('session')
            value.push(this.state.filterSession)
        }
        if(this.state.filterStatus!==""){
            field.push('status')
            value.push(this.state.filterStatus)
        }
        //nếu đang lọc
        if(field.length>0){
            var body_data={
                field:field,
                value:value,
                pageNumber:pageNumber,
                numberForm:'15'
            }
            axios
            .post(
                this.state.domain + "/admin/form_filter",
                body_data,
                {
                    headers: { 
                        "Authorization": this.state.token,
                        "content-type": "application/json", }
                }
            )
            .then(response => {
                this.setState({
                    form_object: response.data.list,
                    TotalPage: response.data.numberPage,
                    activePage:pageNumber
                })
                // console.log(response.data);
                this.data = response.data.list;
            })
            .catch(function (error) {
                console.log(error);
            });
        }
        //nếu không lọc
        else{
            var body_data=  {
                pageNumber: pageNumber,
                numberOfForm: "15",
            }
            axios
                .post(
                    this.state.domain + "/admin/check_all_appointment",
                    body_data,
                    {
                        headers: { 
                            "Authorization": this.state.token,
                            "content-type": "application/json", }
                    }
                )
                .then(response => {
                    this.setState({
                        form_object: response.data.list,
                        activePage:pageNumber
                    })
                    // console.log(response.data);
                    this.data = response.data.list;
                })
                .catch(function (error) {
                    console.log(error);
                });
        }
    }
    
    //render
    render() {
        var {form_object} = this.state;
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

        return(
            <div>
                {/* sidebar */}
                <div id="sidebar-collapse" className="col-sm-3 col-lg-2 sidebar">
                    <div className="divider"></div>
                    <ul className="nav menu">
                        <li className="active">
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
                        <li>
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
                        </ol>
                    </div>
                    <div className="text-center">
                        <h1>
                            Thống kê             
                        </h1>
                    </div>
                    <br/>
                    {/* data tables */}
                    <div className="">
                        <table className="table table-hover mt-15">
                            <thead>
                                <tr>
                                    <th></th>
                                    <th></th>
                                    <th></th>
                                    <th className="text-center">Ngày</th>
                                    <th className="text-center">Tháng</th>
                                    <th className="text-center">Năm</th>
                                    
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                   <td></td>
                                   <td></td>
                                   <td></td>
                                    <td style={{width:"18%"}}>
                                        <input 
                                            type="text" 
                                            className="form-control"
                                            name="filterName" 
                                            value={this.state.filterName}
                                            onChange={this.onChange}
                                            />
                                    </td>
                                    <td style={{width:"18%"}}>
                                    <input 
                                            type="text" 
                                            className="form-control"
                                            name="filterPhoneNum" 
                                            value={this.state.filterPhoneNum}
                                            onChange={this.onChange}
                                            />
                                    </td>
                                    <td style={{width:"18%"}}>
                                    <input 
                                            type="text" 
                                            className="form-control"
                                            name="filterDay" 
                                            value={this.state.filterDay}
                                            onChange={this.onChange}
                                            />
                                    </td>
                                    
                                    
                                    
                                    <td>
                                        <button
                                            className="btn btn-primary"
                                            type="submit"
                                            onClick={this.getFilter}
                                        >
                                            search
                                        </button>
                                    </td>
                                </tr>
                                
                            </tbody>
                            
                        </table>
                        <p>   tìm thấy {this.state.TotalPage} kết quả</p> 

                        <div class="panel panel-container">
                            <div class="row">
                                <div class="col-xs-6 col-md-3 col-lg-3 no-padding">
                                    <div class="panel panel-teal panel-widget border-right">
                                        <div class="row no-padding"><em class="fa fa-xl fa-comments color-blue"></em>
                                            <div class="large">
                                                {this.state.sum_form}
                                            </div>
                                            <div class="text-muted">Tổng số form</div>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-xs-6 col-md-3 col-lg-3 no-padding">
                                    <div class="panel panel-blue panel-widget border-right">
                                        <div class="row no-padding"><em class="fa fa-xl fa-comments color-orange"></em>
                                            <div class="large">
                                                {this.state.morning_form}
                                            </div>
                                            <div class="text-muted">Số form buổi sáng</div>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-xs-6 col-md-3 col-lg-3 no-padding">
                                    <div class="panel panel-orange panel-widget border-right">
                                        <div class="row no-padding"><em class="fa fa-xl fa-comments color-teal"></em>
                                            <div class="large">
                                                {this.state.afternoon_form}
                                            </div>
                                            <div class="text-muted">Số form buổi chiều</div>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-xs-6 col-md-3 col-lg-3 no-padding">
                                    <div class="panel panel-red panel-widget ">
                                        <div class="row no-padding"><em class="fa fa-xl fa-comments color-red"></em>
                                            <div class="large">
                                                {this.state.canceled_form}
                                            </div>
                                            <div class="text-muted">Số form bị hủy</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                   
                   
                    {/* /.main */}
                    {/* return */}
                    
                </div>
            </div>        
            
        ); 
    }
}
export default Kappa;