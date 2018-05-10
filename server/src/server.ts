import http = require('http')

export default class Server {
    //#region fields

    private _port: number

    //#endregion

    //region constructor

    constructor(port: number) {
        this._port = port
    }

    //#endregion

    //#region methods

    public start(): void {
        let server = http.createServer(this.onRequestReceived)

        server.listen(this._port, (err) => {
            if (err)
                console.log(`twitter-live server failed to start: ${err}`)

            console.log(`twitter-live server running on port ${this._port}`)

            //TODO Twitter client initializations
        })
    }

    private onRequestReceived(request, response): void {
        //TODO proper logging for cloud deployment
        console.log(`new request received: ${request.url}`)

        response.end()
    }

    //#endregion
}