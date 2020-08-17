import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import Button from '../../components/Button';
import { withRouter } from 'react-router-dom';
import "./styles.css";

const API = require('../../utils/common');

const ContractorDashboard = ({ history }) => {
    const [description, setDescription] = useState('');
    const [destination, setDestination] = useState('');
    const [startTimestamp, setStartTimestamp] = useState('');
    const [endTimestamp, setEndTimestamp] = useState('');
    const [bidcap, setBidcap] = useState(0);
    const [revisions, setRevisions] = useState(0);
    const [contracts, setContracts] = useState([]);
    const [contractDetails, setContractDetails] = useState('');
    const [displayContractForm, setDisplayContractForm] = useState(true);

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        history.push('/login');
    };

    const onDescriptionChange = (e) => {
        setDescription(e.target.value);
    }
    const onDestinationChange = (e) => {
        setDestination(e.target.value);
    }
    const onStartTimestampChange = (e) => {
        setStartTimestamp(e.target.value);
    }
    const onEndTimestampChange = (e) => {
        setEndTimestamp(e.target.value);
    }
    const onBidcapChange = (e) => {
        setBidcap(e.target.value);
    }
    const onRevisionChange = (e) => {
        setRevisions(e.target.value);
    }

    const handleCreateClick = (e) => {
        e.preventDefault();
        API.postContracts(localStorage.getItem('token'), description, destination, startTimestamp, endTimestamp, bidcap, revisions, result => {
            if (result.status === 200) {
                alert('Saved. Transporters are being notified.');
            }
            else {
                alert("Status: " + result.status);
            }
        });
    }

    const onViewDetailsClick = async (contractID) => {
        const result = await API.getContractDetails(localStorage.getItem('token'), contractID);
        if (result.status === 200) {
            setContractDetails(result.data);
            setDisplayContractForm(false);
        }
        else {
            alert('Unable to get contract details.');
        }
    }

    const hideDetails = () => {
        setDisplayContractForm(true);
        setContractDetails('');
    }

    useEffect(() => {
        async function fetchContracts() {
            const result = await API.getContracts(localStorage.getItem('token'));
            if (result.status === 200) {
                setContracts(result.data);
            }
            else if (result.status === 401) {
                alert('Please login again with correct credentials');
                localStorage.removeItem('token');
                localStorage.removeItem('role');
                history.push('/login');
            }
        }
        fetchContracts();
    }, []);

    return (
        <>
            <Navbar>
                <li><a href="/transporter-dashboard">Dashboard</a></li>
                <li onClick={logout} style={{ float: "right" }}><a href="">Logout</a></li>
            </Navbar>
            <table border="1" style={{ marginTop: '20px' }} className="contracts">
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
                {contracts == '' ? (<tr><td colSpan='7'>No Records Found</td></tr>) : ''}
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
                    </table>
                    <h3>Bids on this contract</h3>
                    {
                        contractDetails.bids && contractDetails.bids.map(bid => (
                            <p>{bid.transporterID.name} - {bid.bidAmount}</p>
                        ))
                    }
                    <Button onClick={() => hideDetails()} className={displayContractForm ? 'hide' : 'display'}>Hide Details</Button>
                </div>
            }
            <h3 className={displayContractForm ? 'display' : 'hide'}>Create Contract</h3>
            <form className={displayContractForm ? 'createForm' : 'hide'}>
                <div class="formControl">
                    <label className="contract-label" for="description">Description</label>
                    <input id="description" type="text" placeholder="Description" value={description} onChange={e => onDescriptionChange(e)} />
                </div>
                <div class="formControl">
                    <label className="contract-label" for="destination">Destination City</label>
                    <input id="destination" type="text" placeholder="Destination City" value={destination} onChange={e => onDestinationChange(e)} />
                </div>
                <div class="formControl">
                    <label className="contract-label" for="start-timestamp">Start Timestamp</label>
                    <input type="datetime-local" id="start-timestamp" value={startTimestamp} min={new Date()} onChange={e => onStartTimestampChange(e)} />
                </div>
                <div class="formControl">
                    <label className="contract-label" for="end-timestamp">End Timestamp</label>
                    <input type="datetime-local" id="end-timestamp" value={endTimestamp} min={new Date()} onChange={e => onEndTimestampChange(e)} />
                </div>
                <div class="formControl">
                    <label className="contract-label" for="bidcap">Bidcap</label>
                    <input id="bidcap" type="number" min="0" placeholder="Bidcap" value={bidcap} onChange={e => onBidcapChange(e)} />
                </div>
                <div class="formControl">
                    <label className="contract-label" for="bidcap">Allowed Revisions</label>
                    <input id="revisions" type="number" min="0" placeholder="Allowed Revisions" value={revisions} onChange={e => onRevisionChange(e)} />
                </div>
                <div class="formControl">
                    <Button onClick={(e) => handleCreateClick(e)}>Create</Button>
                </div>
            </form>
        </>
    )
}

export default withRouter(ContractorDashboard);
