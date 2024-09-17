// controllers/showtime-controller.js

const showtimeRepository = require('../repositories/showtime-repository');

exports.addShowTime = async (req, res) => {
  try {
    const { movie, theater, date, startTime, endTime, price, screenType, isCancellable } = req.body;

    if (!movie || !theater || !date || !startTime || !endTime || !price) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const showtimeData = {
      movie,
      theater,
      date: new Date(date),
      startTime: new Date(startTime),
      endTime: new Date(endTime),
      price: Number(price),
      screenType,
      isCancellable
    };

    const populatedShowtime = await showtimeRepository.create(showtimeData);

    res.status(201).json({
      message: 'Showtime added successfully',
      data: populatedShowtime
    });
  } catch (err) {
    console.error('Error adding showtime:', err);
    res.status(500).json({ message: 'Internal server error', error: err.message });
  }
};

exports.getAllShowtimes = async (req, res) => {
  try {
    const showtimes = await showtimeRepository.findAll();
    res.status(200).json({ message: 'Showtimes fetched successfully', showtimes });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching showtimes", error: err.message });
  }
};

exports.getMovieShowtimes = async (req, res) => {
  const movieId = req.params.id;
  
  try {
    const showtimes = await showtimeRepository.findByMovie(movieId);

    if (!showtimes || showtimes.length === 0) {
      return res.status(404).json({ message: 'No showtimes found for this movie' });
    }

    res.status(200).json({
      message: 'Showtimes retrieved successfully',
      showtimes: showtimes
    });
  } catch (err) {
    console.error('Error fetching showtimes:', err);
    res.status(500).json({ message: 'Error fetching showtimes', error: err.message });
  }
};

exports.seatsByshowtimeId = async (req, res) => {
  const showtimeId = req.params.showtimeId;

  try {
    const showtime = await showtimeRepository.findSeatsByShowtimeId(showtimeId);
    if (!showtime) {
      return res.status(404).json({ message: "Showtime not found" });
    }
    res.status(200).json(showtime);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};

exports.updateShowtime = async (req, res) => {
  try {
    const { id } = req.params;
    let { movie, theater, date, startTime, endTime, price, screenType, isCancellable } = req.body;

    if (!movie || !theater || !date || !startTime || !endTime || !price || !screenType) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    movie = typeof movie === 'object' ? movie._id : movie;
    theater = typeof theater === 'object' ? theater._id : theater;

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
      isCancellable
    };

    const updatedShowtime = await showtimeRepository.update(id, updateData);

    if (!updatedShowtime) {
      return res.status(404).json({ message: 'Showtime not found' });
    }

    res.status(200).json(updatedShowtime);
  } catch (error) {
    console.error('Error updating showtime:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

exports.getShowtimeById = async (req, res) => {
  try {
    const { id } = req.params;

    const showtime = await showtimeRepository.findById(id);

    if (!showtime) {
      return res.status(404).json({ message: 'Showtime not found' });
    }

    const formattedShowtime = {
      ...showtime.toObject(),
      date: showtime.date.toISOString().split('T')[0],
      startTime: showtime.startTime.toTimeString().slice(0, 5),
      endTime: showtime.endTime.toTimeString().slice(0, 5)
    };

    res.status(200).json(formattedShowtime);
  } catch (error) {
    console.error('Error fetching showtime:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.deleteShowtime = async (req, res) => {
  try {
    const { id } = req.params;

    await showtimeRepository.delete(id);

    res.status(200).json({ message: 'Showtime and associated bookings and tickets deleted successfully' });
  } catch (error) {
    console.error('Error deleting showtime:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

exports.showtimesForTheater = async (req, res) => {
  try {
    const { movieId, theaterId, date } = req.query;

    if (!movieId || !theaterId || !date) {
      return res.status(400).json({ message: 'Missing required parameters' });
    }

    const showtimes = await showtimeRepository.findShowtimesForTheater(movieId, theaterId, date);

    res.json(showtimes);
  } catch (error) {
    console.error('Error fetching showtimes:', error);
    res.status(500).json({ message: 'Server error' });
  }
};