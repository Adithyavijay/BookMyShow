const Showtime = require('../models/showtime');
const Movie = require('../models/movie'); // Assuming you have a Movie model

exports.addShowTime = async (req, res) => { 
    try {
        const { 
            movie, 
            theater, 
            date, 
            startTime, 
            endTime, 
            price, 
            screenType, 
            isCancellable 
        } = req.body; 
        console.log(req.body)
        console.log('Received data:');
        console.log('movie:', movie);
        console.log('theater:', theater);
        console.log('date:', date);
        console.log('startTime:', startTime);
        console.log('endTime:', endTime);
        console.log('price:', price);
        console.log('screenType:', screenType);
        console.log('isCancellable:', isCancellable);

        // Validate required fields
        if (!movie || !theater || !date || !startTime || !endTime || !price) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        console.log('creating new show time instance')
        // Create a new Showtime instance
        const newShowtime = new Showtime({
            movie,
            theater,
            date: new Date(date),
            startTime: new Date(startTime),
            endTime: new Date(endTime),
            price: Number(price),
            screenType,
            isCancellable
        });
        
        // Initialize seats
        newShowtime.initializeSeats();
        
        // Save the showtime to the database
        await newShowtime.save();
      
    
        const populatedShowtime = await Showtime.findById(newShowtime._id)
            .populate('movie', 'title')
            .populate('theater', 'name');

        res.status(201).json({
            message: 'Showtime added successfully',
            data: populatedShowtime
        });

    } catch (err) {
        console.error('Error adding showtime:', err);
        res.status(500).json({ message: 'Internal server error', error: err.message });
    }
}; 

exports.getAllShowtimes= async ( req,res) =>{
    try {
        const showtimes = await Showtime.find()
        .populate('movie', 'title')
        .populate('theater', 'name ') 

        console.log(showtimes)
        res.status(200).json({ message : 'show times fetch successfully',showtimes })
    }catch(err){
        console.error(err);
        res.status(500).json({ message : "error fetching moviess",err : err.message})
    }
}

exports.getMovieShowtimes = async (req, res) => {
    const movieId = req.params.id;
    
    try {
        const showtimes = await Showtime.find({ movie: movieId })
            .populate('movie', 'title language genre certificate')
            .populate('theater', 'name location' )

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

exports.seatsByshowtimeId= async(req,res)=>{
    const showtimeId=req.params.showtimeId;
 
    try{    
        const showtime = await Showtime.find({ _id :showtimeId })
        if(!showtime){
            res.status('404').json({message: "show time not found"})
        } 
        res.status(200).json(showtime)
    }catch(err){
        console.log(err)
        res.status(500).json({ error : err.message})
    }
}