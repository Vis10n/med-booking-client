import React, {Component} from 'react';
import axios from 'axios';
import {Link} from 'react-router-dom';
class AppointmentDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            token: localStorage.getItem('token'),
            domain: 'http://localhost:8080',
            id: '',
            name: '',
            phoneNumber: '',
            day: '',
            session:'morning',
            status: 'waiting',
            result: '',
            code: '',
            stay: true,
            begin: '',
            end: '',
            dayId: '',
            gender:'',
            home:'',
            problem:'',
            address:'',
            day_object: [],
            customerSession:'',
            customerGender:'',
            customerStay:'',
            type:""
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
    getAPICheckOneApointment = () => {
        axios
            .post(
                this.state.domain + "/admin/check_one_appointment",
                {
                    id: localStorage.getItem("appointmentId"),
                },
                {
                    headers: { 
                       
                        "content-type": "application/json", }
                }
            )
            .then(response => {
                console.log(response)
                if (response.data.form_object !== null) {
                    this.setState({
                        name:response.data.name,
                        id:response.data.id,
                        phoneNumber:response.data.phoneNumber,
                        day:response.data.day,
                        session:response.data.session,
                        code:response.data.code,
                        status:response.data.status,
                        address:response.data.address,
                        stay:response.data.stay,
                        begin:response.data.begin,
                        end:response.data.end,
                        problem:response.data.problem,
                        result:response.data.result,
                        gender:response.data.gender,
                        type:response.data.type
                    })
                    if(response.data.gender==="male"){
                        this.setState({customerGender:"nam"})
                    } else{
                        this.setState({customerGender:"nữ"})
                    }
                    if(response.data.session==="morning"){
                        this.setState({customerSession:"buổi sáng"})
                    } else{
                        this.setState({customerSession:"buổi chiều"})
                    }
                    if(response.data.stay===true){
                        this.setState({customerStay:"Có"})
                    }else{
                        this.setState({customerStay:"Không"})
                    }
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
    
    componentWillMount() {
        this.getAPICheckOneApointment();
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
        this.stayCheck(); 
        localStorage.setItem('stay',this.state.stay)
        // console.log(this.state.stay)
        // console.log(this.state.stayCheck)
    }


    stayCheck = () => {
        if (this.state.stay === true) {
            this.setState({
                stayCheck: true,
            })          
        }
        else if (this.state.stay === false 
            && this.state.begin !== '' 
            && this.state.end !== '') {
                this.setState({
                    stayCheck: true,
                })
            }
        else {
            this.setState({
                stayCheck: false,
            })
        }
    }
    cancelAppointment = () =>{
        axios
            .post(
                this.state.domain + "/admin/cancelAppointment",
                {
                    id: localStorage.getItem("appointmentId"),
                },
                {
                    headers: { 
                        "Authorization": this.state.token,
                        "content-type": "application/json", }
                }
            )
            .then(response => {
                if(response.data==="success"){
                    alert("Hủy hẹn thành công!")
                    this.setState({
                        status:"canceled"
                    })
                }
                else{
                    alert("Lỗi!")
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    }
    onSubmit = (event) => {
        //chặn submit lên url
        event.preventDefault();
        if(this.state.phoneNumber.length<10||this.state.phoneNumber.length>11){
            alert("số điện thoại không phù hợp")
        }else{
            var form_object=  {
                id: this.state.id,
                name: this.state.name,
                phoneNumber: this.state.phoneNumber,
                day: this.state.day,
                session:this.state.session,
                status: this.state.status,
                result: this.state.result,
                code: this.state.code,
                stay: this.state.stay,
                begin: this.state.begin,
                end: this.state.end,
                dayId: this.state.dayId,
                gender: this.state.gender,
                home:this.state.home,
                address:this.state.address,
                problem:this.state.problem,
            }
            axios
                .post(
                    this.state.domain + "/admin/update_appointment",
                    form_object,
                    {
                        headers: { "content-type": "application/json", }
                    }
                )
                .then(response => {
                    console.log(response)
                    if (response.data === "updated") {
                        alert("Cập nhật thành công !");
                    } else {
                        alert("Lỗi!");
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
        //config cac button
        var backButton;
        if(localStorage.getItem('token') !== null){
            backButton = <button 
                            type="button" 
                            className="btn btn-warning"
                            >
                            <Link to="/HomeAdmin">
                                Quay lại trang chủ
                            </Link>
                        </button>
        } else{
            backButton = <button 
                            type="button" 
                            className="btn btn-warning"
                            >
                            <Link to="/CustomerResult">
                                Quay lại
                            </Link>
                        </button>
        }
        var confirmButton;
        if(localStorage.getItem('token')!==null){
            confirmButton = <button
                                    type="submit"
                                    className="btn btn-primary"
                                    disabled={!this.state.name
                                        || !this.state.phoneNumber
                                        || !this.state.day
                                        || !this.state.session
                                        // || (this.state.stayCheck === false)
                                        }
                                    >
                                    <span className="fa fa-check mr-5"></span>
                                    Xác nhận
                            </button>
        }else{
            confirmButton=null
        }
        var deleteButton;
        if(localStorage.getItem('token')!==null){
            deleteButton = <button 
                                type="button" 
                                className="btn btn-danger"
                                onClick={this.cancelAppointment}
                                >
                                Hủy hẹn
                            </button>
        } else {
            deleteButton = null
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
        //tra cuu ket qua kham
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
        
        var main;
        if (localStorage.getItem('token') !== null){
            main = <div className="panel-body">
                        <form onSubmit={this.onSubmit}>
                            <div className="col-md-6">                                  
                                {/* Họ Tên (input) */}
                                <div className="form-group">
                                    <label>Họ và tên</label>
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
                                {/* Thời gian (input) */}
                                <div className="form-group">
                                    <label>Ngày</label>
                                    <input
                                        type="date"
                                        className="form-control"
                                        name="day"
                                        value={this.state.day}
                                        onChange={this.onChange}
                                        />
                                        
                                </div>
                                <div className="form-group">
                                            <label>Loại đăng ký</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="day"
                                                disabled={true}
                                                value={this.state.type}
                                                onChange={this.onChange} />
                                                
                                            
                                        </div>
                                       
                            </div>
                            <div className="col-md-6">
                                {/* Số điện thoại (input) */}
                                <div className="form-group">
                                    <label>Số điện thoại</label>
                                    <input
                                        type="text"
                                        name="phoneNumber"
                                        className="form-control"
                                        id=""
                                        placeholder="số điện thoại"
                                        value={this.state.phoneNumber}
                                        onChange={this.onChange} />
                                </div>
                                
                                <div className="form-group">
                                    <label>Giới tính <font color="red">*</font></label>
                                    
                                    <select
                                        className="form-control"
                                        name="gender"
                                        value={this.state.gender}
                                        onChange={this.onChange}>
                                        <option value="Nam">Nam</option>
                                        <option value="Nữ">Nữ</option>
                                    </select>
                                </div>
                                {/* Session (select) */}
                                <div className="form-group">
                                    <label>Phiên</label>
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
                                <div className="form-group">
                                    <label>Triệu chứng </label>
                                        <textarea
                                            type="text"
                                            name="problem"
                                            className="form-control"
                                            id=""
                                            placeholder="mô tả triệu chứng của bạn"
                                            value={this.state.problem}
                                            onChange={this.onChange} />
                                </div>
                                <div className="form-group">
                                    <label>Chẩn đoán</label>
                                        <textarea
                                            type="text"
                                            name="result"
                                            className="form-control"
                                            id=""
                                            placeholder="mô tả triệu chứng của bạn"
                                            value={this.state.result}
                                            onChange={this.onChange} />
                                </div>
                            </div>
                            <div className="col-md-6">    
                                {/* stay (radio) */}
                                <div className="form-group">
                                    <label>Nội trú </label>
                                    <div className="radio">
                                        <label>
                                            <input
                                                type="radio"
                                                name="stay"
                                                onClick={this.onChange}
                                                value={this.state.stay}
                                                />
                                            <span className="label label-success">
                                                Có
                                                </span>
                                        </label>
                                    </div>
                                    <div className="radio">
                                        <label>
                                        <input  type="radio" 
                                                name="stay" 
                                                value={this.state.stay}
                                                onChange={this.onChange} />
                                            <span className="label label-default">
                                                Không
                                                </span>
                                        </label>
                                    </div>
                                </div>
                                {/* Begin (input) */}
                                <div className="form-group">
                                    <label>Ngày nhập viện</label>
                                    <input
                                        type="date"
                                        name="begin"
                                        className="form-control"
                                        id=""
                                        placeholder="Ngày nhập viện"
                                        disabled={!this.state.stay}
                                        value={this.state.begin}
                                        onChange={this.onChange} />
                                </div>

                                {/* Thời gian (input) */}
                                <div className="form-group">
                                    <label>Số ngày nội trú</label>
                                    <input
                                        type="text"
                                        name="end"
                                        className="form-control"
                                        id=""
                                        placeholder=""
                                        disabled={!this.state.stay}
                                        value={this.state.end}
                                        onChange={this.onChange} />
                                </div>
                            </div>
                            <div className="col-md-6">
                                <label>Trạng thái lịch hẹn</label>
                                    <select
                                        type="text"
                                        name="status"
                                        className="form-control"
                                        id=""
                                        placeholder="địa chỉ của bạn"
                                        value={this.state.status}
                                        onChange={this.onChange} >
                                            <option value="waiting"> waiting</option>    
                                            <option value="done"> done</option>
                                            <option value="canceled"> canceled</option>  
                                            <option value="canceled"> stay</option>  
                                        </select>
                                    <br/>
                                <label>Code : {this.state.code}</label>
                            </div>
                            <div className="col-md-12">
                            {confirmButton}
                            &nbsp;
                            {backButton}
                            &nbsp;
                            {deleteButton}
                            </div>                        
                                
                        </form>
                    </div>
        }else{
            main = <div className="panel-body">
                        <form onSubmit={this.onSubmit}>
                            <div className="col-md-6">                                  
                                {/* Họ Tên (input) */}
                                <div className="form-group">
                                    <label>Họ và tên: {this.state.name}</label>
                                    
                                </div>
                                <div className="form-group">
                                    <label>Địa chỉ: {this.state.address} </label>
                                </div>
                                {/* Thời gian (input) */}
                                <div className="form-group">
                                    <label>Ngày: {this.state.day}</label>
                                </div>
                                <div className="form-group">
                                    <label>Loại đăng ký: {this.state.type}</label>
                                </div>
                            </div>
                            <div className="col-md-6">
                                {/* Số điện thoại (input) */}
                                <div className="form-group">
                                    <label>Số điện thoại : {this.state.phoneNumber}</label>
                                    
                                </div>
                                
                                <div className="form-group">
                                    <label>Giới tính : {this.state.customerGender}</label>
                                    
                                </div>
                                {/* Session (select) */}
                                <div className="form-group">
                                    <label>Phiên : {this.state.customerSession}</label>
                                </div>
                            </div>
                            <br/>
                            <br/>
                            <br/>
                            <div className="col-md-12">
                                <div className="form-group">
                                
                                    <label>Triệu chứng </label>
                                        <textarea
                                            type="text"
                                            name="problem"
                                            className="form-control"
                                            id=""
                                            disabled={true}
                                            value={this.state.problem}
                                            onChange={this.onChange} />
                                </div>
                           
                                <div className="form-group">
                                    <label>Kết quả</label>
                                        <textarea
                                            type="text"
                                            name="result"
                                            className="form-control"
                                            id=""
                                            disabled={true}
                                            value={this.state.result}
                                            onChange={this.onChange} />
                                </div>
                            </div>
                            <div className="col-md-6">    
                                {/* stay (radio) */}
                                <div className="form-group">
                                    <label>Nội trú : {this.state.customerStay}</label>
                                </div>
                                {/* Begin (input) */}
                                <div className="form-group">
                                    <label>Ngày nhập viện : {this.state.begin}</label>
                                    
                                </div>

                                {/* Thời gian (input) */}
                                <div className="form-group">
                                    <label>Số ngày nội trú : {this.state.end}</label>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <label>Trạng thái lịch hẹn</label>
                                    <input
                                        type="text"
                                        name="status"
                                        className="form-control"
                                        id=""
                                        disabled={true}
                                        value={this.state.status}
                                        onChange={this.onChange} />
                                           
                                  
                                    <br/>
                                <label>Code : {this.state.code}</label>
                            </div>
                            <div className="col-md-12">
                            {confirmButton}
                            &nbsp;
                            {backButton}
                            &nbsp;
                            {deleteButton}
                            </div>                        
                        
                        </form>
                    </div>
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
                            <li className="active">Chi tiết</li>
                        </ol>
                    </div>
                    <div>
                        <h1>
                            Chi tiết cuộc hẹn
                        </h1>
                        <div className="panel panel-info col-xs-13 col-sm-13 col-md-13 col-lg-13">
                            {main}
                        </div>

                    </div>

                    {/* /.main */}
                </div>
            </div>
        );
    }
}
export default AppointmentDetail;