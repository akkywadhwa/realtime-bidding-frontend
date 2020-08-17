import { BACKEND_URL } from '../config/default';
const axios = require('axios');

// Role - Contractor & Transporter
const login = async (userType, username, password) => {
    const result = await axios.get(`${BACKEND_URL}/login`, {
        auth: {
            username: username,
            password: password
        },
        params: {
            userType: userType,
        }
    });
    return result;
}

// Role - Contractor & Transporter
const getContracts = async (token) => {
    const result = await axios.get(`${BACKEND_URL}/contracts`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return result;
}

// Role - Contractor
const postContracts = async (token, description, destination, startTimestamp, endTimestamp, bidcap, revisions, callback) => {
    await axios.post(`${BACKEND_URL}/contracts`, {
        description: description,
        destinationCity: destination,
        startTimestamp: startTimestamp,
        endTimestamp: endTimestamp,
        bidCap: bidcap,
        allowedRevision: revisions,
    }, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    }).then(result => {
        callback(result);
    });
}

// Role - Contractor & Transporter
const getContractDetails = async (token, id) => {
    const result = await axios.get(`${BACKEND_URL}/contracts/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return result;
}

// Role - Transporter
const postBid = async (token, contractID, bidAmount, callback, errorCallback) => {
    await axios.post(`${BACKEND_URL}/bid`, {
        contractID: contractID,
        bidAmount: bidAmount
    }, {
        headers: { Authorization: `Bearer ${token}` },
    }).then(result => {
        callback(result);
    }).catch(error => {
        errorCallback(error);
    });
}

// Role - Transporter
const getAllNotifications = async (token) => {
    const result = await axios.get(`${BACKEND_URL}/notifications`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return result;
}

// Role - Transporter
const putNotification = async (token, notificationID, callback) => {
    console.log(notificationID);
    await axios.put(`${BACKEND_URL}/notifications`, {
        notificationID: notificationID,
    }, {
        headers: { Authorization: `Bearer ${token}` },
    }).then(result => {
        callback(result);
    });
}


export { login, getContracts, postContracts, getContractDetails, postBid, getAllNotifications, putNotification }