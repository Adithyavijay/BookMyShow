const express = require('express');
const theaterRepository=require('../repositories/theater-repository')

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