import express from "express";
import theaterRepository from "../repositories/theater-repository.js";
import { formatTheaterResponse } from "../responses/theater-response.js";

/**
 * Controller for handling theater-related operations
 */
class TheaterController {
    /**
     * @desc Adds a new theater
     * @param {Object} req - Express request object
     * @param {Object} req.body - Request body
     * @param {string} req.body.name - Name of the theater
     * @param {string} req.body.location - Location of the theater
     * @param {number} req.body.capacity - Capacity of the theater
     * @param {Object} res - Express response object
     * @returns {Object} JSON response with the created theater
     */
    async addTheater(req, res) {
        try {
            const { name, location, capacity } = req.body;
            if (!name || !location || !capacity) {
                return res.status(400).json({
                    message:
                        "Please provide name, location, and capacity for the theater",
                });
            }
            const theater = await theaterRepository.create({
                name,
                location,
                capacity,
            });
            res.status(201).json({
                status: true,
                message: "Theater added successfully",
                data: theater,
            });
        } catch (error) {
            console.error("Error adding theater:", error);
            res.status(500).json({
                message: "Error adding theater",
                error: error.message,
            });
        }
    }

    /**
     * @desc Retrieves all theaters
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @returns {Object} JSON response with all theaters
     */
    async getTheaters(req, res) {
        try {
            const theaters = await theaterRepository.findAll();
            const formattedTheaters= theaters.map(formatTheaterResponse)
            res.status(200).json({
                status: true,
                message: "theaters fetched successfully ",
                data: formattedTheaters,
            });
        } catch (error) {
            console.error("Error fetching theaters", error);
            res.status(500).json({
                status: false,
                message: "Error fetching theater list",
                error: error.message,
            });
        }
    }

    /**
     * @desc Retrieves a specific theater by ID
     * @param {Object} req - Express request object
     * @param {string} req.params.id - Theater ID
     * @param {Object} res - Express response object
     * @returns {Object} JSON response with the specified theater
     */
    async getTheaterById(req, res) {
        const id = req.params.id;
        try {
            const theater = await theaterRepository.findById(id);
            if (!theater) {
                return res
                    .status(404)
                    .json({ status: false, message: "Theater not found" });
            }
            res.status(200).json({ theater });
        } catch (err) {
            console.error("Error:", err?.message || err);
            res.status(500).json({
                status: false,
                message: "Error fetching theater",
                error: err.message,
            });
        }
    }

    /**
     * @desc Updates a specific theater
     * @param {Object} req - Express request object
     * @param {string} req.params.id - Theater ID
     * @param {Object} req.body - Request body
     * @param {string} req.body.name - Updated name of the theater
     * @param {string} req.body.location - Updated location of the theater
     * @param {Object} res - Express response object
     * @returns {Object} JSON response with the updated theater
     */
    async update(req, res) {
        try {
            const { id } = req.params;
            const { name, location } = req.body;
            if (!name || !location) {
                return res.status(400).json({
                    status: false,
                    message: "Name and location are required",
                });
            }
            const updatedTheater = await theaterRepository.update(id, {
                name,
                location,
                capacity: 100, // Always set capacity to 100
            });
            if (!updatedTheater) {
                return res
                    .status(404)
                    .json({ status: false, message: "Theater not found" });
            }
            res.status(200).json({
                status: true,
                message: "Theater updated successfully",
                data: formatTheaterResponse(updatedTheater),
            });
        } catch (error) {
            console.error("Error updating theater:", error);
            res.status(500).json({
                status: false,
                message: "Internal server error",
                error: error.message,
            });
        }
    }

    /**
     * @desc Deletes a specific theater
     * @param {Object} req - Express request object
     * @param {string} req.params.id - Theater ID
     * @param {Object} res - Express response object
     * @returns {Object} JSON response with deletion confirmation
     */
    async deleteTheater(req, res) {
        const { id } = req.params;
        try {
            await theaterRepository.delete(id);
            res.status(200).json({
                message: "Theater and associated data deleted successfully",
            });
        } catch (error) {
            console.error("Error deleting theater:", error);
            if (error.message === "Theater not found") {
                res.status(404).json({
                    status: false,
                    message: "Theater not found",
                    error: error.message,
                });
            } else {
                res.status(500).json({
                    status: "false",
                    message: "Internal server error",
                    error: error.message,
                });
            }
        }
    }
}

const theaterController = new TheaterController();
export default theaterController;
