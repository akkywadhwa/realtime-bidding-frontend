import React, { useState, useEffect } from 'react';
import Button from '../../components/Button';
import { withRouter } from 'react-router-dom';
import './styles.css';

const API = require('../../utils/common');

const Login = ({ history }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [userType, setUserType] = useState('');
    const [error, setError] = useState(null);

    useEffect(() => {
        if (localStorage.getItem('token')) {
            switch (localStorage.getItem('role')) {
                case 'transporter':
                    history.push('/transporter-dashboard');
                    break;
                case 'contractor': history.push('/contractor-dashboard');
                    break;
                default:
                    localStorage.removeItem('token');
                    localStorage.removeItem('role');
                    history.push('/login');
            }
        }
    }, []);

    const handleLogin = async () => {
        if (username !== '' && password !== '' && userType !== '') {
            const result = await API.login(userType, username, password);
            console.log(result);
            if (result.status === 200) {
                localStorage.setItem('token', result.data.token);
                localStorage.setItem('role', userType);
                if (userType === 'transporter') history.push('/transporter-dashboard');
                else history.push('/contractor-dashboard');
            } else if (result.status === 401) {
                setError('Incorrect username/password');
                alert('Incorrect username/password');
            }
            else {
                setError('Unable to login at the moment');
                alert('Unable to login at the moment');
            }
        }
        else {
            alert('Please fill the details carefully.');
        }
    }

    const handleUsernameChange = (e) => {
        setUsername(e.target.value);
    }

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    }

    const handleUserTypeChange = (e) => {
        setUserType(e.target.value);
    }

    return (
        <div className="login">
            <div className="radio-group">
                <label style={{ width: '10%' }}>I am a</label>
                <input type="radio" id="contractor" name="user-type" value="contractor" checked={userType === 'contractor'} onChange={(e) => handleUserTypeChange(e)} />
                <label htmlFor="contractor">Contractor</label>
                <input type="radio" id="transporter" name="user-type" value="transporter" checked={userType === 'transporter'} onChange={(e) => handleUserTypeChange(e)} />
                <label htmlFor="transporter">Transporter</label>
            </div>
            <label htmlFor="username">Username</label>&nbsp;
            <input type="text" id="username" placeholder="Username" value={username} onChange={(e) => handleUsernameChange(e)} />
            <br />
            <label htmlFor="password">Password</label>&nbsp;&nbsp;
            <input type="password" id="password" placeholder="Password" value={password} onChange={(e) => handlePasswordChange(e)} />
            <br />
            <p style={{ color: 'red' }}>{error ? error : ''}</p>
            <Button onClick={() => handleLogin()}>Login</Button>
        </div>
    )
}

export default withRouter(Login);