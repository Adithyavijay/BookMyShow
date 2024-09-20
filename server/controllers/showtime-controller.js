// controllers/showtime-controller.js

import showtimeRepository from "../repositories/showtime-repository.js";
import { formatShowtime } from "../responses/showtime-response.js";

/**
 * Controller for handling showtime-related operations
 */
class ShowtimeController {
    /**
     * @desc Adds a new showtime
     * @param {Object} req - Express request object
     * @param {Object} req.body - Request body containing showtime details
     * @param {string} req.body.movie - Movie ID
     * @param {string} req.body.theater - Theater ID
     * @param {string} req.body.date - Date of the showtime
     * @param {string} req.body.startTime - Start time of the showtime
     * @param {string} req.body.endTime - End time of the showtime
     * @param {number} req.body.price - Price of the showtime
     * @param {string} req.body.screenType - Type of screen
     * @param {boolean} req.body.isCancellable - Whether the showtime is cancellable
     * @param {Object} res - Express response object
     * @returns {Object} JSON response with the created showtime
     */
    async addShowTime(req, res) {
        try {
            const {
                movie,
                theater,
                date,
                startTime,
                endTime,
                price,
                screenType,
                isCancellable,
            } = req.body;

            if (
                !movie ||
                !theater ||
                !date ||
                !startTime ||
                !endTime ||
                !price
            ) {
                return res
                    .status(400)
                    .json({ message: "Missing required fields" });
            }

            const showtimeData = {
                movie,
                theater,
                date: new Date(date),
                startTime: new Date(startTime),
                endTime: new Date(endTime),
                price: Number(price),
                screenType,
                isCancellable,
            };

            const populatedShowtime = await showtimeRepository.create(
                showtimeData
            );

            res.status(201).json({
                status: true,
                message: "Showtime added successfully",
                data: populatedShowtime,
            });
        } catch (err) {
            console.error("Error adding showtime:", err);
            res.status(500).json({
                message: "Internal server error",
                error: err.message,
            });
        }
    }

    /**
     * @desc Retrieves all showtimes
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @returns {Object} JSON response with all showtimes
     */
    async getAllShowtimes(req, res) { 
        try {
            const showtimes = await showtimeRepository.findAll();

            const formattedShowtimes= showtimes.map(showtime=>formatShowtime(showtime))
            res.status(200).json({
                status: true,
                message: "Showtimes fetched successfully",
                data: formattedShowtimes,
            });
        } catch (err) {
            console.error(err);
            res.status(500).json({
                status: false,
                message: "Error fetching showtimes",
                error: err.message,
            });
        }
    }

    /**
     * @desc Retrieves showtimes for a specific movie
     * @param {Object} req - Express request object
     * @param {string} req.params.id - Movie ID
     * @param {Object} res - Express response object
     * @returns {Object} JSON response with showtimes for the specified movie
     */
    async getMovieShowtimes(req, res) {
        const movieId = req.params.id;

        try {
            const showtimes = await showtimeRepository.findByMovie(movieId);

            if (!showtimes || showtimes.length === 0) {
                return res.status(404).json({
                    status: false,
                    message: "No showtimes found for this movie",
                });
            }
            const formattedShowtimes= showtimes.map(showtime=>formatShowtime(showtime))
            res.status(200).json({
                status: true,
                message: "Showtimes retrieved successfully",
                data: formattedShowtimes,
            });
        } catch (err) {
            console.error("Error fetching showtimes:", err);
            res.status(500).json({
                status: false,
                message: "Error fetching showtimes",
                error: err.message,
            });
        }
    }

    /**
     * @desc Retrieves seats for a specific showtime
     * @param {Object} req - Express request object
     * @param {string} req.params.showtimeId - Showtime ID
     * @param {Object} res - Express response object
     * @returns {Object} JSON response with seats for the specified showtime
     */
    async seatsByshowtimeId(req, res) {
        const showtimeId = req.params.showtimeId;

        try {
            const showtime = await showtimeRepository.findSeatsByShowtimeId(
                showtimeId
            ); 
            console.log(showtime)
            console.log('formatShowtime : ' , formatShowtime(showtime))
            if (!showtime) {
                return res
                    .status(404)
                    .json({ status: false, message: "Showtime not found" });
            }
            
            res.status(200).json({
                status: true,
                message: "Show time fetched successfully",
                data: formatShowtime(showtime),
            });
        } catch (err) {
            console.log(err);
            res.status(500).json({
                status: false,
                message: "error happpened",
                error: err.message,
            });
        }
    }

    /**
     * @desc Updates a specific showtime
     * @param {Object} req - Express request object
     * @param {string} req.params.id - Showtime ID
     * @param {Object} req.body - Request body containing updated showtime details
     * @param {Object} res - Express response object
     * @returns {Object} JSON response with the updated showtime
     */
    async updateShowtime(req, res) {
        try {
            const { id } = req.params;
            let {
                movie,
                theater,
                date,
                startTime,
                endTime,
                price,
                screenType,
                isCancellable,
            } = req.body;

            if (
                !movie ||
                !theater ||
                !date ||
                !startTime ||
                !endTime ||
                !price ||
                !screenType
            ) {
                return res.status(400).json({
                    status: false,
                    message: "All fields are required",
                });
            }

            movie = typeof movie === "object" ? movie._id : movie;
            theater = typeof theater === "object" ? theater._id : theater;

            const combinedStartTime = new Date(`${date}T${startTime}`);
            const combinedEndTime = new Date(`${date}T${endTime}`);

            const updateData = {
                movie,
                theater,
                date: new Date(date),
                startTime: combinedStartTime,
                endTime: combinedEndTime,
                price,
                screenType,
                isCancellable,
            };

            const updatedShowtime = await showtimeRepository.update(
                id,
                updateData
            );

            if (!updatedShowtime) {
                return res
                    .status(404)
                    .json({ status: false, message: "Showtime not found" });
            }

            res.status(200).json({status: true, message : "showtime updated successfully", data : formatShowtime(updatedData)});
        } catch (error) {
            console.error("Error updating showtime:", error);
            res.status(500).json({
                status: false,
                message: "Internal server error",
                error: error.message,
            });
        }
    }

    /**
     * @desc Retrieves a specific showtime by ID
     * @param {Object} req - Express request object
     * @param {string} req.params.id - Showtime ID
     * @param {Object} res - Express response object
     * @returns {Object} JSON response with the specified showtime
     */
    async getShowtimeById(req, res) {
        try {
            const { id } = req.params;

            const showtime = await showtimeRepository.findById(id);

            if (!showtime) {
                return res
                    .status(404)
                    .json({ status: false, message: "Showtime not found" });
            }

            const formattedShowtime = {
                ...showtime.toObject(),
                date: showtime.date.toISOString().split("T")[0],
                startTime: showtime.startTime.toTimeString().slice(0, 5),
                endTime: showtime.endTime.toTimeString().slice(0, 5),
            };

            res.status(200).json({
                status: true,
                data: formattedShowtime,
                message: "Show time fetched successfully",
            });
        } catch (error) {
            console.error("Error fetching showtime:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    }

    /**
     * @desc Deletes a specific showtime
     * @param {Object} req - Express request object
     * @param {string} req.params.id - Showtime ID
     * @param {Object} res - Express response object
     * @returns {Object} JSON response with deletion confirmation
     */
    async deleteShowtime(req, res) {
        try {
            const { id } = req.params;

            await showtimeRepository.delete(id);

            res.status(200).json({
                status: true,
                message:
                    "Showtime and associated bookings and tickets deleted successfully",
            });
        } catch (error) {
            console.error("Error deleting showtime:", error);
            res.status(500).json({
                status: false,
                message: "Internal server error",
                error: error.message,
            });
        }
    }

    /**
     * @desc Retrieves showtimes for a specific movie, theater, and date
     * @param {Object} req - Express request object
     * @param {string} req.query.movieId - Movie ID
     * @param {string} req.query.theaterId - Theater ID
     * @param {string} req.query.date - Date for showtimes
     * @param {Object} res - Express response object
     * @returns {Object} JSON response with matching showtimes
     */
    async showtimesForTheater(req, res) {
        try {
            const { movieId, theaterId, date } = req.query;

            if (!movieId || !theaterId || !date) {
                return res.status(400).json({
                    status: false,
                    message: "Missing required parameters",
                });
            }

            const showtimes = await showtimeRepository.findShowtimesForTheater(
                movieId,
                theaterId,
                date
            );

            const formattedShowtimes = showtimes.map(showtime=>formatShowtime(showtime))

            res.json({
                status: true,
                data: formattedShowtimes,
                message: "Showtime fetched successfully",
            });
        } catch (error) {
            console.error("Error fetching showtimes:", error);
            res.status(500).json({ message: "Server error" });
        }
    }
}

export default new ShowtimeController();
