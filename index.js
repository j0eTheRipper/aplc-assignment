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

let vehicles = [];

async function getData() {
  const request = await fetch("data.json");
  const response = await request.json();

  for (let i = 0; i < response.length; i++) {
    vehicles.push(Vehicle.fromJSON(response[i]));
  }
}

getData();

function getTotalManufacturedByEachCompany() {
  const resultDivId = "totalManufacturedOut";
  document.getElementById(resultDivId)?.remove(); // remove the result <p> if it exists. The ? is a null check

  const input = document
    .getElementsByName("totalManufacturedInput")[0]
    .value.toLowerCase();

  let result = 0;
  for (car of vehicles)
    (car.manufacturerIs(input) || car.model.toLowerCase() === input) &&
      result++;

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
      if (car.range > resultModel.range) resultModel = car;
    }
  }

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

  let total = 0;
  let count = 0;
  for (car of vehicles) {
    car.ChargingTypeIs(input) && (total += car.chargeTime) && count++;
  }

  const result = total / count;

  resultline.append(
    `Average charge time with ${input}: ${result.toFixed(3)} hours`,
  );
}

function getTopFiveBySafteyRating() {
  const resultDiv = "topFiveBySafteyRatingOut";
  document.getElementById(resultDiv)?.remove();

  const resultList = ResultList("topFiveBySafteyRating", resultDiv);
  let topFive = [vehicles[0]];

  for (let i = 0; i < vehicles.length; i++) {
    for (let j = 0; j < topFive.length; j++) {
      if (topFive.includes(vehicles[i])) {
        continue;
      }
      if (topFive[j].safetyRating < vehicles[i].safetyRating) {
        topFive[j] = vehicles[i];
      }
      if (topFive.length < 5) {
        topFive.push(
          vehicles[j].safetyRating < vehicles[i].safetyRating
            ? vehicles[j]
            : vehicles[i],
        );
      }
    }
  }
  for (car of topFive) {
    const element = document.createElement("li");
    element.append(car.model);
    resultList.appendChild(element);
  }
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
