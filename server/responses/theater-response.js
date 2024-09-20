/**
 * Formats a theater object for API response
 * @param {Object} theater - The raw theater object from the database
 * @returns {Object} A formatted theater object with selected fields
 */
export const formatTheaterResponse = (theater) => {
    return {
        _id: theater._id,
        name: theater.name,
        location: theater.location,
        capacity: theater.capacity
    };
};