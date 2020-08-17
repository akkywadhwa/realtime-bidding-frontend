import React, { useState, useEffect } from 'react';
import Button from '../../components/Button';
import './styles.css';
import { withRouter } from 'react-router-dom';
import socketIOClient from "socket.io-client";
import Navbar from '../../components/Navbar';
import { BASE_URL } from '../../config/default';

const API = require('../../utils/common');


const TransporterDashboard = ({ history }) => {
    const [notifications, setNotifications] = useState([]);
    const [contracts, setContracts] = useState([]);
    const [contractDetails, setContractDetails] = useState('');
    const [showBiddingForm, setShowBiddingForm] = useState(false);
    const [biddingAmount, setBiddingAmount] = useState(0);
    const [showNotification, setShowNotifications] = useState(false);

    useEffect(() => {
        async function fetchContracts() {
            const result = await API.getContracts(localStorage.getItem('token'));
            if (result.status === 200) {
                setContracts(result.data);
                console.log(result);
            }
            else if (result.status === 401) {
                alert('Please login again with correct credentials');
                localStorage.removeItem('token');
                localStorage.removeItem('role');
                history.push('/login');
            }
        }
        fetchContracts();
        showNotificationOnLoad();
        const socket = socketIOClient(BASE_URL);
        socket.on("UPDATE_NOTIFICATIONS", data => {
            let notificationsData = [data];
            if (notifications.length > 0) notificationsData = notifications.concat(notificationsData);
            setNotifications(notificationsData);
            console.log(data);
        });
        socket.on("UPDATE_CONTRACTS", data => {
            let contractsData = [data];
            if (contracts.length > 0) contractsData = contracts.concat(contractsData);
            setContracts(contractsData);
        })
    }, []);

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        history.push('/login');
    };

    const onNotificationClick = () => {
        if (showNotification) setShowNotifications(false);
        else setShowNotifications(true);
    }

    const onBiddingAmountChange = (e) => {
        setBiddingAmount(e.target.value);
    }

    const onViewDetailsClick = async (contractID) => {
        const result = await API.getContractDetails(localStorage.getItem('token'), contractID);
        if (result.status === 200) {
            setContractDetails(result.data);
            console.log(result.data);
        }
        else {
            alert('Unable to get contract details.');
        }
    }

    const onPlaceBidClick = async (contractID) => {
        await API.postBid(localStorage.getItem('token'), contractID, biddingAmount, result => {
            if (result.status === 200) {
                alert('Bid has been placed.');
                setShowBiddingForm(false);
            }
        }, error => {
            if (error.response.status === 400) {
                alert(error.response.data.message);
            }
            else {
                alert('Unable to bid.');
            }
        });
    };

    const showNotificationOnLoad = async () => {
        const result = await API.getAllNotifications(localStorage.getItem('token'));
        console.log("Notifications -", result);
        if (result.status === 200) {
            let notificationsData = result.data;
            if (notifications.length > 0) notificationsData = notifications.concat(notificationsData);
            setNotifications(notificationsData);
        }
        else {
            console.log('Unable to fetch notifications');
        }
    }

    const onReadNotification = async (notificationID) => {
        await API.putNotification(localStorage.getItem('token'), notificationID, result => {
            if (result.status === 200) {
                if (result.data.read) {
                    alert('Notification has been marked read.');
                }
                else {
                    alert("Unable to read the notification");
                }
            } else {
                console.log('Unable to read the notification');
            }
            setShowNotifications(false);
        });
    }

    const onBidNowClick = async () => {
        setShowBiddingForm(true);
    };

    return (
        localStorage.getItem('token') &&
        <>
            <Navbar>
                <li><a href="/contractor-dashboard">Your Dashboard</a></li>
                <li style={{ float: "right" }}><a onClick={() => logout()}>Logout</a></li>
                <li style={{ float: "right" }}><a class="active" onClick={() => onNotificationClick()}>{notifications ? notifications.length : 0} notifications</a></li>
            </Navbar>
            <div className={notifications && showNotification ? "show" : "hide"}>
                {
                    notifications && notifications.map(element => (
                        <div style={{ width: '100%', padding: '10px' }}>
                            <p style={{ width: '80%' }}>{element.contractID.description}</p>
                            <p style={{ marginLeft: '10px', width: '15%', border: '1px solid black' }} onClick={() => onReadNotification(element._id)}>Read</p>
                        </div>
                    ))
                }
            </div>
            <table border="1" className="contracts">
                <tr>
                    <td>Description</td>
                    <td>Destination City</td>
                    <td>Bid Cap</td>
                    <td>Start Date</td>
                    <td>End Date</td>
                    <td>Revisions Allowed</td>
                    <td>Details</td>
                </tr>
                {contracts && contracts.map(contract => (
                    <tr>
                        <td>{contract.description}</td>
                        <td>{contract.destinationCity}</td>
                        <td>Rs.{contract.bidCap}</td>
                        <td>{contract.startTimestamp}</td>
                        <td>{contract.endTimestamp}</td>
                        <td>{contract.allowedRevision}</td>
                        <td><Button onClick={() => onViewDetailsClick(contract._id)}>View Details</Button></td>
                    </tr>
                ))}
            </table>
            {
                contractDetails !== '' &&
                <div className="contract-details">
                    <h5 className="heading">Contract Details</h5>
                    <table>
                        <tr>
                            <td>Description</td>
                            <td>{contractDetails.description}</td>
                        </tr>
                        <tr>
                            <td>Destination City</td>
                            <td>{contractDetails.destinationCity}</td>
                        </tr>
                        <tr>
                            <td>Start Timestamp</td>
                            <td>{contractDetails.startTimestamp}</td>
                        </tr>
                        <tr>
                            <td>End Timestamp</td>
                            <td>{contractDetails.endTimestamp}</td>
                        </tr>
                        <tr>
                            <td>Bid Cap</td>
                            <td>{contractDetails.bidCap}</td>
                        </tr>
                        <tr>
                            <td>Allowed Revisions</td>
                            <td>{contractDetails.allowedRevision}</td>
                        </tr>
                        <tr>
                            <td>Top Bid Amount</td>
                            <td>{contractDetails.topBidAmount ? contractDetails.topBidAmount : "No bids yet"}</td>
                        </tr>
                        {
                            contractDetails.canBidNow && contractDetails.canBidNow === true &&
                            <tr>
                                <td colspan="2" style={{ textAlign: 'center' }}><Button onClick={() => onBidNowClick()}>View Details</Button></td>
                            </tr>
                        }
                    </table>
                    {
                        showBiddingForm &&
                        <>
                            <input type="number" id="biddingAmount" value={biddingAmount} onChange={(e) => onBiddingAmountChange(e)} />
                            <Button onClick={() => onPlaceBidClick(contractDetails._id)}>Place Bid</Button>
                        </>
                    }
                </div>
            }
        </>
    )
}

export default withRouter(TransporterDashboard);