//https://developer.twitter.com/en/docs/tweets/filter-realtime/api-reference/post-statuses-filter
export default interface TwitterApiParameter {
    screen_name?: string
    follow?: string
    track?: string
    locations?: string
    delimited?: number
    stall_warnings?: boolean
}