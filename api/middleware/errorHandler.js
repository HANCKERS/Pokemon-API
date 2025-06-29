const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(e => e.message);
    return res.status(400).json({ error: errors.join(', ') });
  }

  // Mongoose cast error (invalid ObjectId)
  if (err.name === 'CastError') {
    return res.status(400).json({ error: 'Invalid ID format' });
  }

  // Custom error with status
  if (err.status) {
    return res.status(err.status).json({ error: err.message });
  }

  // Handle missing required fields
  if (err.message && err.message.includes('required')) {
    return res.status(400).json({ error: err.message });
  }

  // Default server error
  res.status(500).json({ 
    error: process.env.NODE_ENV === 'production' 
      ? 'Internal server error' 
      : err.message 
  });
};
module.exports = errorHandler;
