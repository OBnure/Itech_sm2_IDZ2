document.addEventListener("DOMContentLoaded", function () {
  const socket = io();

  const carList = document.getElementById("carList");
  const carNumberInput = document.getElementById("carNumber");
  const carBrandInput = document.getElementById("carBrand");
  const driverNameInput = document.getElementById("driverName");
  const addCarBtn = document.getElementById("addCarBtn");

  function renderCarList(cars) {
    carList.innerHTML = "";
    cars.forEach((car) => {
      const li = document.createElement("li");
      const coordinates = car.coordinates || {};
      li.innerHTML = `Car Number: ${car.number}<br>Driver: ${
        car.driverName || "N/A"
      }<br>Brand: ${car.brand || "N/A"}<br>Coordinates: ${
        coordinates.latitude || "N/A"
      }, ${coordinates.longitude || "N/A"}`;
      carList.appendChild(li);
    });
  }

  socket.on("updateCars", function (cars) {
    renderCarList(cars);
  });

  carNumberInput.addEventListener("input", function () {
    this.value = this.value.replace(/\D/g, ""); 
  });

  driverNameInput.addEventListener("input", function () {
    this.value = this.value.replace(/[^a-zA-Z]/g, ""); 
  });

  carBrandInput.addEventListener("input", function () {
    this.value = this.value.replace(/[^a-zA-Z]/g, ""); 
  });

  addCarBtn.addEventListener("click", function () {
    const carData = {
      number: carNumberInput.value,
      brand: carBrandInput.value,
      driverName: driverNameInput.value,
    };

    socket.emit("addCar", carData);
  });
});
