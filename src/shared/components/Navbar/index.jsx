import React from 'react';
import './style.css';

export default function Navbar({
    children
}) {
    return (
        <ul>
            {children}
        </ul>
    )
}

Navbar.propTypes = {
    children: null
}