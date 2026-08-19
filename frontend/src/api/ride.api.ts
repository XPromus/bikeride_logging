import { RideGetDto, TrackPoint } from "../types/ride.types"
import { deleteRequest, getRequest, uploadRequest } from "./generic.api"

export const getRides = async (): Promise<RideGetDto[]> => {
    const url: string = "http://localhost:3000/gpx";
    return await getRequest<RideGetDto[]>(url, undefined);
}

export const getRidePoints = async (
    id: string
): Promise<TrackPoint[]> => {
    const url: string = `http://localhost:3000/gpx/points/${id}`
    return await getRequest<TrackPoint[]>(url, undefined);
}

export const uploadRide = async (file: File): Promise<RideGetDto> => {
    const url: string = "http://localhost:3000/gpx/upload";
    const formData = new FormData();
    formData.append("file", file);
    return await uploadRequest<RideGetDto>(url, formData);
}

export const deleteRide = async (id: string) => {
    const url: string = `http://localhost:3000/gpx/${id}`;
    await deleteRequest(url);
}
