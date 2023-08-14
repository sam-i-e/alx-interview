#!/usr/bin/node

const request = require('request');

function getMovieCharacters (movieId) {
  const filmUrl = `https://swapi.dev/api/films/${movieId}/`;
  return new Promise((resolve, reject) => {
    request.get(filmUrl, (error, response, body) => {
      if (error) {
        reject(error);
      } else {
        const filmData = JSON.parse(body);
        resolve(filmData.characters);
      }
    });
  });
}

function getCharacterName (characterUrl) {
  return new Promise((resolve, reject) => {
    request.get(characterUrl, (error, response, body) => {
      if (error) {
        reject(error);
      } else {
        const characterData = JSON.parse(body);
        resolve(characterData.name);
      }
    });
  });
}

function printCharacters (movieId) {
  getMovieCharacters(movieId)
    .then(characters => {
      if (characters.length === 0) {
        console.log('No characters found for the given movie ID.');
        return;
      }

      Promise.all(characters.map(getCharacterName))
        .then(characterNames => {
          characterNames.forEach(name => console.log(name));
        })
        .catch(error => {
          console.error('Error fetching character names:', error);
        });
    })
    .catch(error => {
      console.error('Error fetching movie characters:', error);
    });
}

const movieId = process.argv[2];

if (!movieId) {
  console.log('Usage: ./script.js <movie_id>');
} else {
  printCharacters(movieId);
}
