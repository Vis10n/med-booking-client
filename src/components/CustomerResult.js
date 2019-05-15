import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import axios from "axios";
import AppointmentList from './Administrator/AppointmentList';
import '../css/App.css';
import Pagination from "react-js-pagination";
class CustomerResult extends Component {
    constructor(props) {
        super(props);
        this.state = {
            domain: 'http://localhost:8080',
            status: '',
            code: '',
            form_object: [],
            data:[],
            activePage:1,
            TotalPage:0,
            filterName: '',
            filterPhoneNum: '',
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
        var field = []
        var value = []
        field.push("name")
        value.push(this.state.filterName)
        field.push("phoneNumber")
        value.push(this.state.filterPhoneNum)
        this.setState({
            activePage:1
        })
        var body_data={
            field:field,
            value:value,
            pageNumber:this.state.activePage,
            numberForm:'15'
        }
        axios
            .post(
                this.state.domain + "/customer_result",
                body_data,
                {
                    headers: {"content-type": "application/json" }
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
                this.state.domain + "/customer_result",
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
    }
    // xóa token và đăng xuất
    signOut = () => {
        // console.log(localStorage.getItem("token"));
        localStorage.removeItem("token");
    }
    
    render() {
        var {form_object} = this.state;
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
                        <li className="active">
                            <Link to="/CustomerResult">
                                <em className="fa fa-dashboard">
                                    &nbsp;
                                </em>
                                Tra cứu kết quả khám
                            </Link>
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
                            <li className="active">Hủy lịch</li>
                        </ol>
                    </div>
                    <div>
                        <h1>
                            Tra cứu kết quả khám
                        </h1>
                        <div className="panel panel-info col-xs-6 col-sm-6 col-md-6 col-lg-6">
                            
                            <div className="panel-body">
                                <form onSubmit={this.onSubmit}>                                   
                                        {/* Họ Tên (input) */}
                                        <div className="form-group col-md-6">
                                            <label>Họ và tên</label>
                                            <input
                                                type="text"
                                                name="filterName"
                                                className="form-control"
                                                id=""
                                                placeholder=""
                                                value={this.state.filterName}
                                                onChange={this.onChange} />
                                            
                                        </div>
                                        <div className="form-group col-md-6">
                                            <label>Số điện thoại</label>
                                            <input
                                                type="text"
                                                name="filterPhoneNum"
                                                className="form-control"
                                                id=""
                                                placeholder=""
                                                value={this.state.filterPhoneNum}
                                                onChange={this.onChange} />
                                            
                                        </div>
                                        {/* Button hoàn tất  */}
                                      
                                        <button
                                            type="submit"
                                            className="btn btn-primary"
                                            disabled={!this.state.filterPhoneNum
                                                        ||!this.state.filterName
                                            }
                                        >
                                            <span className="fa fa-check mr-5"></span>
                                            Xác nhận
                                        </button>
                                          
                                </form>
                            </div>
                            
                        </div>
                        <div>
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
                            </table>  
                        </div>
                        <p>   tìm thấy {this.state.TotalPage} kết quả</p> 
                        <AppointmentList
                            form_object={form_object}
                            onDetail={this.onDetail} />
                    </div>
                    <div>
                        <Pagination
                        activePage={this.state.activePage}
                        itemsCountPerPage={15}
                        totalItemsCount={this.state.TotalPage}
                        pageRangeDisplayed={5}
                        onChange={this.handlePageChange}
                        />
                    </div>
                    {/* /.main */}
                </div>
            </div>
        );
    }
}
export default CustomerResult;