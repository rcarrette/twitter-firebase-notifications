import http = require('http')
import TwitterClient from './twitter/twitter-client'

export default class Server {
    //#region fields

    private port: number
    private twitterClient: TwitterClient

    //#endregion

    //region constructor

    constructor(port: number) {
        this.port = port
        this.twitterClient = new TwitterClient()
    }

    //#endregion

    //#region methods

    public start(): void {
        let server = http.createServer(this.onRequestReceived)

        server.listen(this.port, (error) => {
            if (error)
                console.log(`twitter-firebase-notifications server failed to start: ${error}`)
            else {
                console.log(`twitter-firebase-notifications server running on port ${this.port}`)

                //start listening for new tweets
                this.twitterClient.startListening()
            }
        })
    }

    private onRequestReceived(request, response): void {
        //TODO proper logging for cloud deployment
        console.log(`new request received: ${request.url}`)

        response.end()
    }

    //#endregion
}