require('dotenv').config();

import Server from './server'

//server entry point
new Server(process.env.PORT || '8080')
    .start()