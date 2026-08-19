export type RideGetDto = {
    _id: string,
    name: string,
    date: string,
    distance: number,
    elevation: number,
    avgSpeed: number,
    __v: number,
}

export type TrackPoint = {
    latitude: number,
    longitude: number,
    elevation: number,
    time?: number,
}
