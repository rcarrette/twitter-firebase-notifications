import Twitter = require('twitter')
import TwitterApiParameter from './interfaces/twitter-api-parameter'
import * as _ from 'lodash'

//TODO put in .env files and .gitignore them
const consumerKey: string = 'LbLFmxdw1oV5DMLMMcO99Z0DD'
const consumerSecret: string = 'OaRkUkZfpZNwelJ3cFtEFhEKSx6QBdbJ5tgwKEW5tUIozRfTTI'
const accessTokenKey: string = '3246193737-hdzeVoVlKuBeX9864CPnkTZHltGyp1mr4gjuU6B'
const accessTokenSecret: string = 'EJYsxjUdXtA8TAxsrU4WKuBwh3nMG0D0aq7TNb0NvKeMS'

const usersLookupApiRoute: string = 'users/lookup'
const statusesFilterApiRoute: string = 'statuses/filter'
const userNameToFollow: string = 'nodejs'

export default class TwitterClient {
    //#region fields

    private api: any

    //#endregion

    //region constructor

    constructor() {
        this.api = new Twitter({
            consumer_key: consumerKey,
            consumer_secret: consumerSecret,
            access_token_key: accessTokenKey,
            access_token_secret: accessTokenSecret
        })
    }

    //#endregion

    //#region methods

    public startListening() {
        let usersLookupPayload: TwitterApiParameter = { screen_name: userNameToFollow }

        this.api.get(usersLookupApiRoute, usersLookupPayload, (error, data) => {
            if (error) {
                console.log(`twitter-client::startListening error: ${error}`) //TODO proper logging for cloud deployment

                return;
            }
            else {
                let userIdToFollow = _.first(data).id_str

                if (userIdToFollow == null) {
                    console.log('twitter-client::startListening userId is null') //TODO proper logging for cloud deployment

                    return;
                }

                let statusesFilterPayload: TwitterApiParameter = { follow: userIdToFollow },
                    stream = this.api.stream(statusesFilterApiRoute, statusesFilterPayload)

                // TODO fluent notation
                stream.on('data', this.onNewTweetReceived)
                stream.on('error', this.onStreamError)
            }
        })
    }

    private onNewTweetReceived(event): void {
        //TODO Firebase push notification
        console.log(event && event.text)
    }

    private onStreamError(error): void {
        console.log(error) //TODO proper logging for cloud deployment
    }

    //#endregion
}