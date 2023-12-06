require('dotenv').config();
const cors = require('cors');
const express = require('express');
const axios = require('axios');

const PORT = process.env.PORT || 3005;
const app = express();

// middleware
app.use(cors());


// routes
app.get('/photos', fetchPhotos);
app.get('*', notFound);

// helper functions
async function fetchPhotos(request, response, next) {

  const searchQuery = request.query.searchQuery;

  try {
    const url = `https://api.unsplash.com/search/photos/?client_id=${process.env.UNSPLASH_ACCESS_KEY}&query=${searchQuery}`;

    const photosResponse = await axios.get(url);

    const photos = photosResponse.data.results.map(item => new Photo(item));

    response.json(photos);

  } catch (error) {
    next(error);
  } 
}

function notFound(request, response) {
  response.status(404).send('the page you are looking for is not there.')
}

function errorHandler(error, request, response, next) {
  response.status(500).send('something went wrong ' + error.message);
}

// classes
class Photo {
  constructor(obj) {
    this.img_url = obj.urls.regular;
    this.original_image = obj.links.self;
    this.photographer = obj.user.name;
  }
}

// start the server
app.listen(PORT, () => console.log('Server listening on PORT', PORT));
