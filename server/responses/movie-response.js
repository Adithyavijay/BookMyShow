/**
 * Formats a movie object according to the defined schema.
 * @param {Object} movie - The raw movie object from the database.
 * @returns {Object} A formatted movie object with selected fields.
 */
export const formatMovie = (movie) => {
    return {
        _id:movie._id,
        title: movie.title,
        description: movie.description,
        duration: movie.duration,
        genre: movie.genre,
        language: movie.language,
        releaseDate: movie.releaseDate,
        certificate: movie.certificate,
        photos: movie.photos,
        poster: movie.poster,
        director: movie.director,
        cast: movie.cast.map(castMember => ({
            castName: castMember.castName,
            castPhoto: castMember.castPhoto
        })),
        theaters: movie.theaters, // This will be an array of ObjectIds
        averageRating: movie.averageRating,
        ratings: movie.ratings.length,
        reviews: movie.reviews.map(review => ({
            user: review.user, // This will be an ObjectId
            text: review.text,
            date: review.date
        }))
    };
};