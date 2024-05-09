const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

let cars = [];

function updateCarCoordinates() {
    cars.forEach(car => {
        car.coordinates = generateRandomCoordinates();
    });
    io.emit('updateCars', cars);
}

function generateRandomCoordinates() {
    return {
        latitude: Math.random() * (90 - (-90)) + (-90),
        longitude: Math.random() * (180 - (-180)) + (-180)
    };
}

function isCarNumberUnique(number) {
    return cars.every(car => car.number !== number);
}

function addCar(carData) {
    const { number } = carData;
    if (!isCarNumberUnique(number)) {
        console.log(`Car with number ${number} already exists.`);
        return;
    }

    cars.push(carData);
    io.emit('updateCars', cars);
}

setInterval(updateCarCoordinates, 5000);

io.on('connection', (socket) => {
    console.log('A new client connected');
    socket.on('addCar', (carData) => {
        addCar(carData);
    });
});

app.use(express.static(__dirname + '/public'));

server.listen(3000, () => {
    console.log('Server is running on port 3000');
});
