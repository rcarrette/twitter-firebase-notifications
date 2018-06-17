import * as FirebaseEngine from 'firebase-admin'
import FirebaseAppSettings from './interfaces/firebase-app-settings'

export default class FirebaseNotificationsService {
    //#region fields
    //#endregion

    //#region constructor
    //#endregion

    //#region methods

    public init(): void {
        let firebaseSettings: FirebaseAppSettings = {
            credential: FirebaseEngine.credential.applicationDefault(),
            databaseURL: process.env.FIREBASE_DB_URL
        }

        try {
            FirebaseEngine.initializeApp(firebaseSettings)

            console.log(`successfully init Firebase`)
        }
        catch (ex) {
            console.log(`firebase-notifications-service::init error: ${ex}`)
        }
    }

    public async notify(tweetContent: string): Promise<void> {
        let message: any = {
            notification: {
                body: tweetContent
            },
            token: process.env.TARGET_DEVICE_TOKEN
        }

        try {
            let notificationResponse = await FirebaseEngine.messaging().send(message)

            console.log(`successfully sent notification: ${notificationResponse}`)
        }
        catch (ex) {
            console.log(`firebase-notifications-service::notify error: ${ex}`)
        }
    }

    //#endregion
}