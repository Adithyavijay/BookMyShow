import mongoose from 'mongoose'

const theaterSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  capacity: { type: Number, required: true },
  seatLayout: {
    rows: { type: Number, default: 10 },
    seatsPerRow: { type: Number, default: 10 }
  }
});

export default mongoose.model('Theater', theaterSchema);