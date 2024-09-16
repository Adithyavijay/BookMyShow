const multer = require('multer');
const path = require('path');


const uploadDir = path.join(__dirname, '..', 'public', 'uploads');
// Configure storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir) 
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname))
  }
});

// File filter
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Not an image! Please upload an image.'), false);
  }
};

// Multer upload configuration
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});
const uploadMovieFiles = upload.fields([
    { name: 'poster', maxCount: 1 },
    { name: 'photos', maxCount: 5 },
    { name: 'castPhoto0', maxCount: 1 },
    { name: 'castPhoto1', maxCount: 1 },
    { name: 'castPhoto2', maxCount: 1 },
    { name: 'castPhoto3', maxCount: 1 },
    { name: 'castPhoto4', maxCount: 1 }
  ]);
  
module.exports ={
    upload,
    uploadMovieFiles
}