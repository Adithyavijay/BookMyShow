const express = require('express');
const theaterRepository=require('../repositories/theater-repository')
const Theater=require('../models/theater')
const Showtime=require('../models/showtime')
const Ticket=require('../models/ticket')
const Movie=require('../models/movie')

exports.addTheater = async (req, res) => {
  try {
    const { name, location, capacity } = req.body;

    // Validate input
    if (!name || !location || !capacity) {
      return res.status(400).json({ message: 'Please provide name, location, and capacity for the theater' });
    }

    // create a new theater
    const theater = await theaterRepository.create({
      name: name ,
      location:location,
      capacity
    })


    // Send a success response
    res.status(201).json({
      message: 'Theater added successfully',
      theater: newTheater
    });
  } catch (error) {
    // Handle errors
    console.error('Error adding theater:', error);
    res.status(500).json({ message: 'Error adding theater', error: error.message });
  } 
}; 
exports.getTheaters =async(req,res)=>{ 
  
  try{
    const theaters= await theaterRepository.findAll()
    res.status(200).json({theaters})
  }catch(error){
    console.error("error fetching theaters",error)
    res.status(500).json({message:"error fetching theater list ",error:error.message})
  } 

}

exports.getTheaterById = async ( req,res)=>{ 
  const id=req.params.id;
  try{
    const theater= await theaterRepository.findById(id)
    if(!theater){
      res.status(404).json({message : 'theater not found'})
    }
    res.status(200).json({theater});
  }catch(err){
    console.error( "error : ",err?.message || err)
  }
} 

exports.update=async(req,res)=>{ 
  try {
    const { id } = req.params;
    const { name, location } = req.body;

    // Validate input
    if (!name || !location) {
      return res.status(400).json({ message: 'Name and location are required' });
    }

    // Find the theater and update it
    const updatedTheater = await Theater.findByIdAndUpdate(
      id,
      { 
        name, 
        location,
        capacity: 100 // Always set capacity to 100
      },
      { new: true, runValidators: true }
    );

    if (!updatedTheater) {
      return res.status(404).json({ message: 'Theater not found' });
    }

    res.status(200).json({ 
      message: 'Theater updated successfully', 
      theater: updatedTheater 
    });
  } catch (error) {
    console.error('Error updating theater:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
} 

exports.deleteTheater = async (req, res) => {
  const { id } = req.params;

  try {
    // Start a session for transaction
    const session = await Theater.startSession();
    session.startTransaction();

    try {
      // Find the theater
      const theater = await Theater.findById(id).session(session);
      if (!theater) {
        await session.abortTransaction();
        return res.status(404).json({ message: 'Theater not found' });
      }

      // Find all showtimes for this theater
      const showtimes = await Showtime.find({ theater: id }).session(session);

      // Delete all tickets associated with these showtimes
      for (const showtime of showtimes) {
        await Ticket.deleteMany({ showtime: showtime._id }).session(session);
      }

      // Delete all showtimes for this theater
      await Showtime.deleteMany({ theater: id }).session(session);

      // Remove this theater from all movies that reference it
      await Movie.updateMany(
        { theaters: id },
        { $pull: { theaters: id } }
      ).session(session);

      // Finally, delete the theater
      await Theater.findByIdAndDelete(id).session(session);

      // Commit the transaction
      await session.commitTransaction();
      res.status(200).json({ message: 'Theater and associated data deleted successfully' });
    } catch (error) {
      // If an error occurred, abort the transaction
      await session.abortTransaction();
      throw error;
    } finally {
      // End the session
      session.endSession();
    }
  } catch (error) {
    console.error('Error deleting theater:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};