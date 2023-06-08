const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

// Set up Express
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect('mongodb://0.0.0.0:27017/concerts', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Define the Concert schema and model
const concertSchema = new mongoose.Schema({
  title: String,
  date: Date,
  time:String,
  description: String,
});
const Concert = mongoose.model('Concert', concertSchema);

// Serve static files
app.use(express.static(__dirname + '/public'));



app.get('/concerts', async (req, res) => {
  try {
    const concerts = await Concert.find();
    res.json(concerts);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch concerts' });
  }
});

app.post('/concerts', async (req, res) => {
  try {
    const concert = new Concert(req.body);
    await concert.save();
    res.json(concert);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create concert' });
  }
});

app.put('/concerts/:id', async (req, res) => {
  try {
    const concert = await Concert.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(concert);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update concert' });
  }
});

app.delete('/concerts/:id', async (req, res) => {
  try {
    await Concert.findByIdAndRemove(req.params.id);
    res.sendStatus(204);
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete concert' });
  }
});

// Start the server
const port = 3000;
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
