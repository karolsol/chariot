function generateButtons(id) {
  const infoBtnHtml = `<button type="button" class="btn btn-sm btn-outline-info me-1 edit-btn ms-1" onclick="infoEntry(${id})"><i class="bi bi-pencil"></i>Info</button>`;
  const editBtnHtml = `<button type="button" class="btn btn-sm btn-outline-primary me-1 edit-btn ms-1" onclick="editEntry(${id})"><i class="bi bi-pencil"></i>Edit</button>`;
  const deleteBtnHtml = `<button type="button" class="btn btn-sm btn-outline-danger delete-btn ms-1" onclick="deleteEntry(${id})"><i class="bi bi-trash"></i>Delete</button>`;
  return infoBtnHtml + editBtnHtml + deleteBtnHtml;
}

function deleteEntry(id) {
  fetch(`/api/vehicles/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("access_token"),
    },
  }).then(async (response) => {
    if (response.ok) {
      refreshCards();
    }
  });
}

const editModal = new bootstrap.Modal(
  document.getElementById("editEntryModal"),
);

const addEntryModal = new bootstrap.Modal(
  document.getElementById("addEntryModal"),
);

function editEntry(id) {
  editModal.show();
  fetch(`/api/vehicles/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("access_token"),
    },
  }).then(async (response) => {
    if (response.ok) {
      const data = await response.json();
      document.getElementById("editId").value = data["id"];
      document.getElementById("editRegistrationNumber").value = data["registrationNumber"];
      document.getElementById("editVehicleType").value = data["vehicleType"];
      document.getElementById("editMake").value = data["make"];
      document.getElementById("editModel").value = data["model"];
      document.getElementById("editYear").value = data["year"];
      document.getElementById("editMileage").value = parseInt(data["initialMileage"]);
      document.getElementById("editVin").value = data["vin"];
      document.getElementById("editFuelType").value = data["fuelType"];
    }
  });
}

const refreshCards = () => {
  let cards = document.getElementById("vehiclesCards");
  cards.innerHTML = "";
  fetch("/api/vehicles/", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("access_token"),
    },
  }).then(async (response) => {
    if (response.ok) {
      const data = await response.json();
      for (let i = 0; i < data.length; i++) {
        let value = document.getElementById("vehicleFilter").value;
        if (value !== "all" && data[i]["vehicleType"] !== parseInt(value))
          continue;
        let fuel = document.getElementById("fuelTypeFilter").value;
        if (fuel !== "all" && data[i]["fuelType"] !== parseInt(fuel))
          continue;
        const vehicle = data[i];
        const title = `${vehicle.make} ${vehicle.model}`;
        const vin = vehicle.vin;
        const reg = vehicle.registrationNumber;
        const year = vehicle.year;
        const buttons = generateButtons(vehicle["id"])
        let card = document.createElement('div');
        card.className = 'col-md-4';
        card.innerHTML = `
<div class="card shadow h-100">
          <div class="card-body">
            <h5 class="card-title">${title}</h5>
            <div class="mb-2">
              <p class="card-text mb-0">VIN: ${vin}</p>
              <p class="card-text mb-0">Registration number: ${reg}</p>
              <p class="card-text mb-0">Year of production: ${year}</p>
            </div>
            ${buttons}
          </div>
        </div>
        `;
        cards.appendChild(card);
      }
    } else {
      console.error("Failed to fetch refuels data");
    }
  });
};
refreshCards();
let vehicleFilter = document.getElementById("vehicleFilter");
let fuelType = document.getElementById("fuelTypeFilter");
vehicleFilter.onchange = refreshCards;
fuelType.onchange = refreshCards;

document.getElementById("popupSubmitButton").onclick = (event) => {
  event.preventDefault();
  fetch("api/vehicles", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("access_token"),
    },
    body: JSON.stringify({
      vin: document.getElementById("Vin").value,
      registrationNumber: document.getElementById("RegistrationNumber").value,
      make: document.getElementById("Make").value,
      model: document.getElementById("Model").value,
      year: parseInt(document.getElementById("Year").value),
      initialMileage: parseInt(document.getElementById("Mileage").value),
      vehicleType: parseInt(document.getElementById("VehicleType").value),
      fuelType: parseInt(document.getElementById("FuelType").value),
    }),
  }).then(async (response) => {
    if (response.ok) {
      refreshCards();
      addEntryModal.hide();
    }
  });
};

document.getElementById("editSubmitButton").onclick = (event) => {
  event.preventDefault();
  fetch(`api/vehicles/${document.getElementById("editId").value}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("access_token"),
    },
    body: JSON.stringify({
      vin: document.getElementById("editVin").value,
      registrationNumber: document.getElementById("editRegistrationNumber").value,
      make: document.getElementById("editMake").value,
      model: document.getElementById("editModel").value,
      year: parseInt(document.getElementById("editYear").value),
      initialMileage: parseInt(document.getElementById("editMileage").value),
      vehicleType: parseInt(document.getElementById("editVehicleType").value),
      fuelType: parseInt(document.getElementById("editFuelType").value),
    }),
  }).then(async (response) => {
    if (response.ok) {
      refreshCards();
      editModal.hide();
    }
  });
}