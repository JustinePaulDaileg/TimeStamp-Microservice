// server.js
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();

// Enable CORS so freeCodeCamp can test the API remotely
app.use(cors({ optionsSuccessStatus: 200 }));

// Serve static files and the home page
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

function buildResponse(date) {
  let parsed;

  if (date === undefined || date === '') {
    // Empty parameter: current time
    parsed = new Date();
  } else if (/^-?\d+$/.test(date)) {
    // All-digit strings are Unix timestamps in milliseconds
    parsed = new Date(Number(date));
  } else {
    // Anything else that new Date() can parse
    parsed = new Date(date);
  }

  if (isNaN(parsed.getTime())) {
    return { error: 'Invalid Date' };
  }

  return { unix: parsed.getTime(), utc: parsed.toUTCString() };
}

// Empty date parameter
app.get('/api', (req, res) => {
  res.json(buildResponse());
});

// Date parameter provided
app.get('/api/:date', (req, res) => {
  res.json(buildResponse(req.params.date));
});

// The freeCodeCamp tests call http://localhost:8000/
const PORT = process.env.PORT || 8000;
const listener = app.listen(PORT, (err) => {
  if (err) {
    console.error('Could not start server:', err.message);
    process.exit(1);
  }
  console.log('Your app is listening on port ' + listener.address().port);
});