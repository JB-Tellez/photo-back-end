'use strict';

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const PORT = process.env.PORT;

const app = express();

// middleware
app.use(cors());

// routes
app.get('/photos', getPhotos);
app.get('*', notFound);
app.use('*', errorHandler);

// helper functions
async function getPhotos(request, response) {
  const searchQuery = request.query.searchQuery;

  const url = `https://api.unsplash.com/search/photos/?client_id=${process.env.UNSPLASH_ACCESS_KEY}&query=${searchQuery}`;

  try {
    const photosResponse = await axios.get(url);
    const photoArray = photosResponse.data.results.map(photo => new Photo(photo));
    response.status(200).send(photoArray);
  } catch (error) {
    console.error('error fetching photos', error);
    next(error);
  }
}

function notFound(request, response) {
  response.status(404).send('the page you are looking for is not there');
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

// start server
app.listen(PORT, () => console.log(`listening on ${PORT}`));
