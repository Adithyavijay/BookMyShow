/**
 * Formats a user object for API response
 * @param {Object} user - The raw user object from the database
 * @returns {Object} A formatted user object with selected fields
 */
export const formatUserResponse = (user) => {
    return {
        id: user._id,
        username: user.username,
        email: user.email,
        profilePicture: user.profilePicture,
        ticketInfo: {
            totalTickets: user.totalTickets,
            activeTickets: user.activeTickets
        },
        lastBooking: user.lastBooking,
        upcomingMovie: user.upcomingMovie || null
    };
};  