const mongoose = require('mongoose');

const castMemberSchema = new mongoose.Schema({
  castName: { type: String, required: true },
  castPhoto: { type: String } // URL to cast member's photo
});

const movieSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  duration: { type: Number, required: true }, // in minutes
  genre: { type: String, required: true },
  language: { type: String, required: true },
  releaseDate: { type: String, required: true },
  certificate: { type: String, required: true }, // New field for certificate
  photos: [{ type: String }], // URLs to photos
  poster: { type: String, required: true }, // URL to poster
  director: { type: String, required: true },
  cast: [castMemberSchema],
  theaters : [ { type : mongoose.Schema.Types.ObjectId,ref: 'Theater'}],
  ratings: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    value: { type: Number, min: 1, max: 5 }
  }],
  averageRating: { type: Number, default: 0 },
  reviews: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    text: String,
    date: { type: Date, default: Date.now }
  }]
});


movieSchema.pre('save', function(next) {
  if (this.ratings.length > 0) {
    this.averageRating = this.ratings.reduce((sum, rating) => sum + rating.value, 0) / this.ratings.length;
  }
  next();
});

module.exports = mongoose.model('Movie', movieSchema);