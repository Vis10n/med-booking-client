import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import axios from 'axios';
import Pagination from "react-js-pagination";
import '../../css/App.css';
import AppointmentSessionList from './AppointmentSessionList';

class HomeAppointmentSession extends Component {
    constructor(props) {
        super(props);
        this.state = {
            token: localStorage.getItem('token'),
            domain: 'http://localhost:8080',
            day_object: [],
            filterDay: '',
            filterMorning: '',
            filterAfternoon: '',
            filterMorningMax: '',
            filterAfternoonMax: '',
            activePage:1,
            TotalPage:0,
        }
    }

    // lấy API /check_available_case
    getAPICheckAllDay = () => {
        var body_data={
            pageNumber: "1",
            numberOfForm: "15",
        }
        axios
            .post(
                this.state.domain + "/admin/check_schedule",
                body_data,
                {
                    headers: { 
                        "content-type": "application/json",
                        "Authorization": this.state.token, 
                    }
                }
            )
            .then(response => {
                this.setState({
                    day_object: response.data.list,       
                    TotalPage:response.data.numberPage       
                })
            })
    }

    getFilter=()=>{
 
        var field = []
        var value = []
        if(this.state.filterDay!==""){
            field.push('day')
            value.push(this.state.filterDay)
        }
        if(this.state.filterMorning!==""){
            field.push('morningCase')
            value.push(this.state.filterMorning)
        }
        if(this.state.filterAfternoon!==""){
            field.push('afternoonCase')
            value.push(this.state.filterAfternoon)
        }
        if(this.state.filterAfternoonMax!==""){
            field.push('afternoonMaxCase')
            value.push(this.state.filterAfternoonMax)
        }
        if(this.state.filterMorningMax!==""){
            field.push('morningMaxCase')
            value.push(this.state.filterMorningMax)
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
                this.state.domain + "/admin/day_filter",
                body_data,
                {
                    headers: { 
                        "Authorization": this.state.token,
                        "content-type": "application/json", }
                }
            )
            .then(response => {
                this.setState({
                    day_object: response.data.list,
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
            this.getAPICheckAllDay()
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
    // CWM
    componentWillMount() {
        this.getAPICheckAllDay();
    }
    handlePageChange=(pageNumber)=>{
        // alert( pageNumber);
        // kiểm tra xem có đang lọc thông tin hay không
        var field = []
        var value = []
        if(this.state.filterDay!==""){
            field.push('day')
            value.push(this.state.filterDay)
        }
        if(this.state.filterMorning!==""){
            field.push('morningCase')
            value.push(this.state.filterMorning)
        }
        if(this.state.filterAfternoon!==""){
            field.push('afternoonCase')
            value.push(this.state.filterAfternoon)
        }
        if(this.state.filterAfternoonMax!==""){
            field.push('afternoonMaxCase')
            value.push(this.state.filterAfternoonMax)
        }
        if(this.state.filterMorningMax!==""){
            field.push('morningMaxCase')
            value.push(this.state.filterMorningMax)
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
                this.state.domain + "/admin/day_filter",
                body_data,
                {
                    headers: { 
                        "Authorization": this.state.token,
                        "content-type": "application/json", }
                }
            )
            .then(response => {
                this.setState({
                    day_object: response.data.list,
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
                    this.state.domain + "/admin/check_schedule",
                    body_data,
                    {
                        headers: { 
                            "Authorization": this.state.token,
                            "content-type": "application/json", }
                    }
                )
                .then(response => {
                    this.setState({
                        day_object: response.data.list,
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
        // Lấy day_object từ state để sử dụng
        var {day_object} = this.state;

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
                        <Link to="/CancelBooking">
                            <em className="fa fa-dashboard">
                                &nbsp;
                            </em>
                            Hủy lịch khám
                        </Link>
                    </li>
                    <li className="active">
                        <Link to="/HomeAppointmentSession">
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
                <div className="col-md-6">
                    <h1>
                        Danh sách phiên làm việc               
                    </h1>
                </div>
                <div className="col-md-6">
                    <div className="position-relative">
                        <button
                            type="button"
                            className="btn btn-success"
                        > 
                        <Link to="/AddNewDay" >
                            Lên lịch cho ngày mới
                        </Link>
                            
                        </button>
                    </div>
                </div>
                <div>

                </div>
                <br/>
                {/* data tables */}
                <div className="">
                    <table className="table table-hover mt-15">
                        <thead>
                            <tr>
                                <th className="text-center">STT</th>
                                <th className="text-center">Ngày</th>
                                <th className="text-center">Số ca sáng</th>
                                <th className="text-center">Số ca chiều</th>
                                <th className="text-center">Giới hạn ca sáng</th>
                                <th className="text-center">Giới hạn ca chiều</th>
                                {/* <th lassName="text-center">action</th> */}
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td></td>
                                <td>
                                    <input 
                                        type="text" 
                                        className="form-control"
                                        name="filterDay" 
                                        value={this.state.filterDay}
                                        onChange={this.onChange}/>
                                </td>
                                <td>
                                <input 
                                        type="text" 
                                        className="form-control"
                                        name="filterMorning" 
                                        value={this.state.filterMorning}
                                        onChange={this.onChange}/>
                                </td>
                                <td>
                                <input 
                                        type="text" 
                                        className="form-control"
                                        name="filterAfternoon" 
                                        value={this.state.filterAfternoon}
                                        onChange={this.onChange}/>
                                </td>
                                <td>
                                <input 
                                        type="text" 
                                        className="form-control"
                                        name="filterMorningMax" 
                                        value={this.state.filterMorningMax}
                                        onChange={this.onChange}/>
                                </td>
                                <td>
                                <input 
                                        type="text" 
                                        className="form-control"
                                        name="filterAfternoonMax" 
                                        value={this.state.filterAfternoonMax}
                                        onChange={this.onChange}/>
                                </td>
                                <td>
                                    <button
                                        type="submit"
                                        onClick={this.getFilter}
                                    >
                                        search
                                    </button> 
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <p> tìm thấy {this.state.TotalPage} kết quả</p>   
                    <AppointmentSessionList
                        day_object={day_object}
                        onDetail={this.onDetail} />
                </div>
                {/* phân trang */}
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
export default HomeAppointmentSession;