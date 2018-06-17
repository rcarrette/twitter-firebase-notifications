import { credential } from 'firebase-admin'

export default interface FirebaseAppSettings {
    credential: credential.Credential
    databaseURL: string
}