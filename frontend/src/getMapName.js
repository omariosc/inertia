export default function getMapName(id, scooters, map_locations) {
    try {
        return String.fromCharCode(scooters[id].depoId + 64) + ' - ' + map_locations[scooters[id].depoId - 1].name
    } catch (e) {
        return 'Depot longer exists'
    }
}