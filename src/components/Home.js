import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import axios from 'axios';

import Logo from '../images/confused.png';

class Home extends Component {

    // Hàm khởi tạo
    constructor(props) {
        super(props);
        this.state = {
            domain: 'http://localhost:8080',
        }
    }

    // Lấy API check server khi truy cập
    getAPIHome = () => {
        axios
            .get(
                this.state.domain + "/home",
                {},
                {
                    headers: { "content-type": "application/json" }
                }
            )
            .then(response => {
                console.log("GET: " + response.status + " - Hello world");
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    // CWM
    componentWillMount() {
        this.getAPIHome();
    }
    
    // render
    render() {

        // render jsx
        return(
            <div>
                {/* sidebar */}
                <div id="sidebar-collapse" className="col-sm-3 col-lg-2 sidebar">
                    <div className="divider"></div>
                    <ul className="nav menu">
                        <li className="active">
                            <Link to="/">
                                <em className="fa fa-dashboard">
                                    &nbsp;
                                </em>
                                Trang chủ
                            </Link>
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
                            <Link to="/CustomerResult">
                                <em className="fa fa-dashboard">
                                    &nbsp;
                                </em>
                                Tra cứu kết quả khám
                            </Link>
                        </li>
                        <li>
                            <Link to="/Login">
                                <em className="fa fa-dashboard">
                                    &nbsp;
                                </em>
                                Đăng nhập (Admin only)
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
                        </ol>
                    </div>
                    <div className="text-center">
                        <h1>
                            Hệ thống Med .Booking Online                           
                        </h1>
                        <img src={Logo} alt="frog"/>
                    </div>

                    {/* /.main */}
                </div>
                      
            </div>     
           
        ); 
    }
}
export default Home;