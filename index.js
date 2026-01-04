class Vehicle {
  constructor(
    id,
    manufacturer,
    model,
    year,
    batteryType,
    batteryCapacity,
    range,
    chargingType,
    chargeTime,
    price,
    color,
    countryOfManufacture,
    autonomousLevel,
    co2Emmission,
    safetyRating,
    unitsSold,
    warranty,
  ) {
    this.id = id;
    this.manufacturer = manufacturer;
    this.model = model;
    this.year = year;
    this.batteryType = batteryType;
    this.batteryCapacity = batteryCapacity;
    this.range = range;
    this.chargingType = chargingType;
    this.chargeTime = chargeTime;
    this.price = price;
    this.color = color;
    this.countryOfManufacture = countryOfManufacture;
    this.autonomousLevel = autonomousLevel;
    this.co2Emmission = co2Emmission;
    this.safetyRating = safetyRating;
    this.unitsSold = unitsSold;
    this.warranty = warranty;
  }

  static fromJSON(obj) {
    return new Vehicle(
      obj.Vehicle_ID,
      obj.Manufacturer,
      obj.Model,
      obj.Year,
      obj.Battery_Type,
      obj.Battery_Capacity_kWh,
      obj.Range_km,
      obj.Charging_Type,
      obj.Charge_Time_hr,
      obj.Price_USD,
      obj.Color,
      obj.Country_of_Manufacture,
      obj.Autonomous_Level,
      obj.CO2_Emissions_g_per_km,
      obj.Safety_Rating,
      obj.Units_Sold_2024,
      obj.Warranty_Years,
    );
  }

  manufacturerIs(manufacturer) {
    return this.manufacturer.toLowerCase() === manufacturer.toLowerCase();
  }

  ChargingTypeIs(chargingType) {
    return this.chargingType.toLowerCase() === chargingType.toLowerCase();
  }
}

let vehicles = []; // list of vehicles from the json file

async function getData() {
  // function that fills the vehicles array
  const request = await fetch("data.json");
  const response = await request.json();

  for (let i = 0; i < response.length; i++) {
    vehicles.push(Vehicle.fromJSON(response[i])); // use the factory method in the class to cast the data to the Vehicle type
  }
}

getData();

function getTotalManufacturedByEachCompany() {
  const resultDivId = "totalManufacturedOut";
  document.getElementById(resultDivId)?.remove(); // remove the result <p> if it exists. The ? is a null check

  // get the input and normalize it
  const input = document
    .getElementsByName("totalManufacturedInput")[0]
    .value.toLowerCase();

  let result = 0;

  for (car of vehicles)
    // for each car, check if the manufacturer or the model matches the input
    (car.manufacturerIs(input) || car.model.toLowerCase() === input) &&
      result++; // increment if true

  // create the new element containting the result and add it to the page
  const resultDiv = ResultLine("totalByEachCompany", resultDivId);
  resultDiv.append(`number of cars by ${input}: ${result}`);
}

function getModelsByCompany() {
  const resultDiv = "modlesByCompanyOut";
  document.getElementById(resultDiv)?.remove();

  const input = document
    .getElementsByName("listOfModelsInput")[0]
    .value.toLowerCase();

  const list = ResultList("listOfModels", resultDiv);

  // loop through the list of vehicles, and add the ones that fit the manufacturer
  for (car of vehicles) {
    const isNotAdded = !list.innerHTML.includes(car.model);

    if (car.manufacturerIs(input) && isNotAdded) {
      const element = document.createElement("li");
      element.append(car.model);
      list.appendChild(element);
    }
  }
}

function getLongestDrivingRange() {
  const resultDiv = "longestDrivingRangeOut";
  document.getElementById(resultDiv)?.remove();

  const input = document
    .getElementsByName("longestDrivingRangeInput")[0]
    .value.toLowerCase();

  const resultline = ResultLine("longestDrivingRange", resultDiv);

  let resultModel;
  for (car of vehicles) {
    if (car.manufacturerIs(input)) {
      if (!resultModel) resultModel = car; // if the resultModel variable is empty
      if (car.range > resultModel.range) resultModel = car; // compare and swap if the current car has a longer driving range than the stored car
    }
  }

  // append the result to the document
  resultline.append(
    `Longest range by ${input}: ${resultModel.model} at ${resultModel.range}km`,
  );
}

function getAverageChargingTime() {
  const resultDiv = "averageChargingTimeOut";
  document.getElementById(resultDiv)?.remove();

  const input = document
    .getElementsByName("averageChargingTimeInput")[0]
    .value.toLowerCase();

  const resultline = ResultLine("averageChargingTime", resultDiv);

  let totalChargingTime = 0;
  let count = 0;
  for (car of vehicles) {
    // short circuit: if the charging type matches, add the charging time and increment the count
    car.ChargingTypeIs(input) &&
      (totalChargingTime += car.chargeTime) &&
      count++;
  }

  const averageChargingTime = totalChargingTime / count;

  resultline.append(
    `Average charge time with ${input}: ${averageChargingTime.toFixed(3)} hours`,
  );
}

function getTopFiveBySafteyRating() {
  const resultDiv = "topFiveBySafteyRatingOut";
  document.getElementById(resultDiv)?.remove();

  const resultList = ResultList("topFiveBySafteyRating", resultDiv);
  let topFive = [vehicles[0]];

  for (let i = 0; i < vehicles.length; i++) {
    for (let j = 0; j < topFive.length; j++) {
      if (topFive.includes(vehicles[i])) continue;

      let lesserSafteyRating = vehicles[i]; // assume the current vehicle has the least safety

      // compare the top "j" with the current vehicle
      if (topFive[j].safetyRating < vehicles[i].safetyRating) {
        lesserSafteyRating = topFive[j]; // change the lesserSafetyRating to fit
        topFive[j] = vehicles[i]; // swap
      }

      // push the lesserSafety to the end of the array if the array is < 5 elements
      topFive.length < 5 && topFive.push(lesserSafteyRating);
    }
  }

  // add the top five elements to the document
  for (car of topFive) {
    const element = document.createElement("li");
    element.append(`${car.manufacturer}: ${car.model}`);
    resultList.appendChild(element);
  }
}

function getBestSelling() {
  const resultDiv = "bestSellingOut";
  document.getElementById(resultDiv)?.remove();
  let result = vehicles[0];

  for (car of vehicles) {
    car.sales > result.sales && (result = car);
  }

  const resultLine = ResultLine("bestSellingVehicle", resultDiv);
  resultLine.append(result.model);
}

function ResultList(parentId, id) {
  const div = document.getElementById(parentId);
  const resultDiv = document.createElement("div");
  resultDiv.setAttribute("class", "resultBox");
  resultDiv.setAttribute("id", id);
  div.appendChild(resultDiv);
  const list = document.createElement("ul");
  resultDiv.appendChild(list);

  return list;
}

function ResultLine(parentId, id) {
  const div = document.getElementById(parentId);
  const resultDiv = document.createElement("div");
  resultDiv.setAttribute("id", id);
  div.append(resultDiv);

  return resultDiv;
}
