    const express = require('express');
    const mongoose = require('mongoose');
    const dotenv = require('dotenv');
    const path=require('path')
    const adminRoutes=require('./routes/admin')
    const userRoutes = require('./routes/user')
    const session = require('express-session');
    const cookies=require('cookie-parser')



    const cors=require('cors')
    dotenv.config();

    const app = express();
    app.use(cors({
      origin: 'http://localhost:3000', 
      credentials: true,
    }));
    app.use(cookies());

    app.use(session({
      secret: process.env.SESSION_SECRET,
      resave: true,
      saveUninitialized: true,
      cookie: {
        secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
      }
    }));

    // Connect to MongoDB
    mongoose.connect(process.env.MONGODB_URI)
      .then(() => console.log('Connected to MongoDB'))
      .catch(err => console.error('Could not connect to MongoDB', err));

    // Middlewares
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(express.static(path.join(__dirname, 'public')));


      app.get('/', (req, res) => {
        res.json({ message: 'Welcome to the Movie Verification API' });
      });

    // Routes 
      app.use('/api/admin',adminRoutes);
      app.use('/api/user',userRoutes)
      
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
