class Vehicle {
  constructor(id, manufacturer, model, year, batteryType, batteryCapacity, range, chargingType, chargeTime, price, color, countryOfManufacture, autonomousLevel, co2Emmission, safetyRating, unitsSold, warranty) {
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
      obj.Warranty_Years
    );
  }
}


let vehicles = [];

async function getData() {
  const request = await fetch('data.json');
  const response = await request.json();

  for (let i = 0; i < response.length; i++) {
    vehicles.push(Vehicle.fromJSON(response[i]));
  }
}

getData();

async function getTotalManufacturedByEachCompany() {
  document.getElementById('totalManufacturedOut')?.remove();  // remove the result <p> if it exists. The ? is a null check

  const input = document.getElementsByName('totalManufacturedInput')[0].value.toLowerCase();

  let result = 0;
  for (car of vehicles)
    (car.manufacturer.toLowerCase() === input || car.model.toLowerCase() === input) && result++;

  const div = document.getElementById('totalByEachCompany');
  const p = document.createElement('p');

  p.append(`number of cars by ${input}: ${result}`);
  p.setAttribute('id', 'totalManufacturedOut')
  div.append(p)
}

async function getModelsByCompany() {
  document.getElementById('modlesByCompanyOut')?.remove();
  const input = document.getElementsByName('listOfModelsInput')[0].value.toLowerCase();

  const div = document.getElementById('listOfModels');
  const resultDiv = document.createElement('div');
  resultDiv.setAttribute('class', 'resultBox');
  resultDiv.setAttribute('id', 'modlesByCompanyOut');
  div.appendChild(resultDiv);
  const list = document.createElement('ul');
  resultDiv.appendChild(list);

  for (car of vehicles) {
    if (car.manufacturer.toLowerCase() === input && !resultDiv.innerText.includes(car.model)) {
      console.log(car.manufacturer);
      const element = document.createElement('li');
      element.append(car.model);
      list.appendChild(element);
    }
  }
}
