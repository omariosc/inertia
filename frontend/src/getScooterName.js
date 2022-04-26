import getMapName from "./getMapName";

export default function getScooterName(id, scooters, map_locations) {
    try {
        return `Scooter ${scooters[id].softScooterId} (${getMapName(id, scooters, map_locations)})`
    } catch (e) {
        return `Scooter ${scooters[id].softScooterId} (${getMapName(id, scooters, map_locations)})`
    }
}