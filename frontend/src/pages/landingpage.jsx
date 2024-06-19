import React from 'react';
import Navbar from '../components/navbar';

const Home = () => {
    return (
        <div>
           <Navbar/>
            <div className='container'>
                <h1>Welcome to our website</h1>
            </div>
        </div>
    );
}

export default Home;