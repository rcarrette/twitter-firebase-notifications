require('dotenv').config();

import Server from './server'

//server entry point
new Server(1337)
    .start()