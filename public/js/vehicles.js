function generateButtons(id) {
  const infoBtnHtml = `<button type="button" class="btn btn-sm btn-outline-info me-1 edit-btn ms-1" onclick="infoEntry(${id})"><i class="bi bi-pencil"></i>Info</button>`;
  const editBtnHtml = `<button type="button" class="btn btn-sm btn-outline-primary me-1 edit-btn ms-1" onclick="editEntry(${id})"><i class="bi bi-pencil"></i>Edit</button>`;
  const deleteBtnHtml = `<button type="button" class="btn btn-sm btn-outline-danger delete-btn ms-1" onclick="deleteEntry(${id})"><i class="bi bi-trash"></i>Delete</button>`;
  return infoBtnHtml + editBtnHtml + deleteBtnHtml;
}

const refreshTable = () => {
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
refreshTable();
let vehicleFilter = document.getElementById("vehicleFilter");
let fuelType = document.getElementById("fuelTypeFilter");
vehicleFilter.onchange = refreshTable;
fuelType.onchange = refreshTable;