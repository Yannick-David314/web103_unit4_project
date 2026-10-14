import React from 'react'
import { Link } from 'react-router-dom'
import '../App.css'
import '../css/Navigation.css'

const Navigation = () => {
    return (
        <nav>
            <ul>
                <li><h1>Shippuden Shinobi 🍥</h1></li>
            </ul>

            <ul>
                <li><Link to='/' role='button'>Create</Link></li>
                <li><Link to='/shinobi' role='button'>View Shinobi</Link></li>
            </ul>

        </nav>
    )
}

export default Navigation
