export const formatShowtime = (showtime) => {
    return {
        _id: showtime._id,
        movie: showtime.movie?._id 
            ? {
                _id: showtime.movie._id  ,
                title: showtime.movie.title ,
                language: showtime.movie.language || null,
                genre: showtime.movie.genre || null,
                certificate: showtime.movie.certificate || null,
                theaters: showtime.movie.theaters || [],
                duration: showtime.movie.duration || null
              }
            : showtime.movie,
        theater: showtime.theater?._id
            ? {
                _id: showtime.theater._id,
                name: showtime.theater.name,
                location: showtime.theater.location || null
              }
            : showtime.theater,
        date: showtime.date,
        startTime: showtime.startTime,
        endTime: showtime.endTime,
        price: showtime.price,
        screenType: showtime.screenType,
        isCancellable: showtime.isCancellable,
        seats: showtime.seats?.map(seat => ({
            seatNumber: seat.seatNumber,
            isBooked: seat.isBooked
        })) || [],
        totalSeats: showtime.totalSeats,
        availableSeats: showtime.availableSeats
    };
};