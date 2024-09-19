import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  isEmailVerified : { type: String},
  profilePicture : { type : String},
  phoneNumber: { type: String },
  bookings: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Booking' }]
});

export default mongoose.model('User', userSchema);  