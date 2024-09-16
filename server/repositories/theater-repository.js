const Theater= require('../models/theater')

class TheaterRepository {
    async create(theaterData) {
      const theater = new Theater(theaterData);
      return await theater.save();
    }
  
    async findAll() {
      return await Theater.find({});
    }
  
    async findById(id) {
      return await Theater.findById(id);
    }
  
    async update(id, updateData) {
      return await Theater.findByIdAndUpdate(id, updateData, { new: true });
    }
  
    async delete(id) {
      return await Theater.findByIdAndDelete(id);
    }
  }
  
  module.exports = new TheaterRepository();