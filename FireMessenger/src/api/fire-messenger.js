import axios from 'axios';

export default axios.create(
    {
        baseURL: 'http://8db86a016ac2.ngrok.io'
    }
)