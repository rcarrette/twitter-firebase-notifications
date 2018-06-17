import Twitter = require('twitter')
import TwitterApiParameter from './interfaces/twitter-api-parameter'
import FirebaseNotificationsService from '../firebase/firebase-notifications-service'
import * as _ from 'lodash'

const usersLookupApiRoute: string = 'users/lookup'
const statusesFilterApiRoute: string = 'statuses/filter'

export default class TwitterClient {
    //#region fields

    private api: any
    private firebaseNotificationsService: FirebaseNotificationsService

    //#endregion

    //region constructor

    constructor() {
        this.api = new Twitter({
            consumer_key: process.env.TWITTER_CONSUMER_KEY,
            consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
            access_token_key: process.env.ACCESS_TOKEN_KEY,
            access_token_secret: process.env.ACCESS_TOKEN_SECRET
        })
        this.firebaseNotificationsService = new FirebaseNotificationsService()  //TODO DI
    }

    //#endregion

    //#region methods

    public startListening() {
        let usersLookupPayload: TwitterApiParameter = { screen_name: process.env.USER_NAME_TO_FOLLOW }

        this.api.get(usersLookupApiRoute, usersLookupPayload, (error, data) => {
            if (error) {
                console.log(`twitter-client::startListening error: ${error}`)

                return;
            }
            else {
                let userIdToFollow = _.first(data).id_str

                if (userIdToFollow == null) {
                    console.log('twitter-client::startListening userId is null')

                    return;
                }

                let statusesFilterPayload: TwitterApiParameter = { follow: userIdToFollow },
                    stream = this.api.stream(statusesFilterApiRoute, statusesFilterPayload),
                    self = this

                //register hooks
                stream.on('data', (event) => {
                    //send push notification through Firebase
                    console.log(`onNewTweetReceived: ${event.text}`)

                    self.firebaseNotificationsService.notify(event.text)
                })
                stream.on('error', this.onStreamError)

                console.log(`listening to tweets from ${process.env.USER_NAME_TO_FOLLOW}...`)

                //start FCM service
                this.firebaseNotificationsService.init()
            }
        })
    }

    private onStreamError(error): void {
        console.log(error)
    }

    //#endregion
}