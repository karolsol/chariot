function deleteEntry(id) {
  fetch(`/api/maintenances/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("access_token"),
    },
  }).then(async (response) => {
    if (response.ok) {
      refreshTable();
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
  fetch(`/api/maintenances/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("access_token"),
    },
  }).then(async (response) => {
    if (response.ok) {
      const data = await response.json();
      document.getElementById("editId").value = data["id"];
      document.getElementById("editEntryVehicle").value = data["vehicleId"];
      document.getElementById("editTitle").value = data["title"];
      document.getElementById("editDescription").value = data["description"];
      const d = new Date(data["date"]);
      const pad = (n) => n.toString().padStart(2, "0");
      document.getElementById("editDate").value = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
      document.getElementById("editCost").value = data["cost"];
      document.getElementById("editInvoiceLink").value =
        data["invoiceLink"] || "";
      document.getElementById("editMileage").value = data["mileage"];
    }
  });
}

function generateButtons(id) {
  const fragment = document.createDocumentFragment();

  const editBtn = document.createElement("button");
  editBtn.type = "button";
  editBtn.className = "btn btn-sm btn-outline-primary me-1 edit-btn ms-1";
  editBtn.addEventListener("click", () => editEntry(id));
  const editIcon = document.createElement("i");
  editIcon.className = "bi bi-pencil";
  editBtn.appendChild(editIcon);
  editBtn.append(" Edit");

  const deleteBtn = document.createElement("button");
  deleteBtn.type = "button";
  deleteBtn.className = "btn btn-sm btn-outline-danger delete-btn ms-1";
  deleteBtn.addEventListener("click", () => deleteEntry(id));
  const deleteIcon = document.createElement("i");
  deleteIcon.className = "bi bi-trash";
  deleteBtn.appendChild(deleteIcon);
  deleteBtn.append("Delete");

  fragment.appendChild(editBtn);
  fragment.appendChild(deleteBtn);

  return fragment;
}

const refreshTable = () => {
  let table = document.getElementById("vehiclesTableBody");
  table.innerHTML = "";
  fetch("/api/maintenances/", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("access_token"),
    },
  }).then(async (response) => {
    if (response.ok) {
      const data = await response.json();
      data.sort((a, b) => new Date(b.date) - new Date(a.date));
      for (let i = 0; i < data.length; i++) {
        let value = document.getElementById("vehicleFilter").value;
        if (value !== "all" && data[i]["Vehicle"]["id"] !== parseInt(value))
          continue;
        let dateRange = document.getElementById("dateRange").value;
        if (dateRange !== "all") {
          const days = parseInt(dateRange);
          if (!isNaN(days)) {
            const cutoff = new Date();
            cutoff.setHours(0, 0, 0, 0);
            cutoff.setDate(cutoff.getDate() - days);
            console.log(cutoff);
            if (new Date(data[i]["date"]) < cutoff) continue;
          }
        }
        let line = document.createElement("tr");
        let vehicle = document.createElement("td");
        vehicle.textContent = `${data[i]["Vehicle"]["make"]} ${data[i]["Vehicle"]["model"]}`;
        line.appendChild(vehicle);

        let title = document.createElement("td");
        title.textContent = data[i]["title"];
        line.appendChild(title);

        let dateField = document.createElement("td");
        const date = new Date(data[i]["date"]);
        dateField.textContent = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
        line.appendChild(dateField);


        let mileage = document.createElement("td");
        mileage.textContent = data[i]["mileage"];
        line.appendChild(mileage);

        let cost = document.createElement("td");
        cost.textContent = data[i]["cost"];
        line.appendChild(cost);

        let invoiceColumn = document.createElement("td");
        if (data[i]["invoiceLink"]) {
          let invoice = document.createElement("a");
          invoice.textContent = "invoice";
          invoice.classList.add("badge");
          invoice.classList.add("bg-success");
          invoice.classList.add("ms-1");
          invoice.href = data[i]["invoiceLink"];
          invoiceColumn.appendChild(invoice);
        }
        line.appendChild(invoiceColumn);

        let buttons = document.createElement("td");
        buttons.appendChild(generateButtons(data[i]["id"]));
        line.appendChild(buttons);

        table.appendChild(line);
      }
    } else {
      console.error("Failed to fetch maintenance data");
    }
  });
};
refreshTable();
let vehicleFilter = document.getElementById("vehicleFilter");
let dateRange = document.getElementById("dateRange");
let entryVehicle = document.getElementById("entryVehicle");
let editEntryVehicle = document.getElementById("editEntryVehicle");
vehicleFilter.onchange = refreshTable;
dateRange.onchange = refreshTable;
fetch("/api/vehicles", {
  method: "GET",
  headers: {
    "Content-Type": "application/json",
    Authorization: "Bearer " + localStorage.getItem("access_token"),
  },
})
  .then(async (response) => {
    if (response.ok) {
      const data = await response.json();
      for (let i = 0; i < data.length; i++) {
        let option = document.createElement("option");
        option.value = data[i]["id"];
        option.text = `${data[i]["make"]} ${data[i]["model"]}`;
        vehicleFilter.appendChild(option);
        entryVehicle.appendChild(option.cloneNode(true));
        editEntryVehicle.appendChild(option.cloneNode(true));
      }
    } else {
      console.error("Failed to fetch user info");
    }
  })
  .catch((error) => {
    console.error("Error:", error);
  });

document.getElementById("popupSubmitButton").onclick = (event) => {
  event.preventDefault();

  fetch("api/maintenances", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("access_token"),
    },
    body: JSON.stringify({
      vehicleId: parseInt(entryVehicle.value),
      date: document.getElementById("date").value,
      invoiceLink: document.getElementById("invoiceLink").value || null,
      title: document.getElementById("title").value,
      description: document.getElementById("description").value,
      cost: parseFloat(document.getElementById("cost").value),
      mileage: parseInt(document.getElementById("mileage").value),
    }),
  }).then(async (response) => {
    if (response.ok) {
      refreshTable();
      addEntryModal.hide();
    }
  });
};

document.getElementById("editSubmitButton").onclick = (event) => {
  event.preventDefault();
  fetch(`api/maintenances/${document.getElementById("editId").value}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("access_token"),
    },
    body: JSON.stringify({
      date: document.getElementById("editDate").value,
      fuelAmount: parseFloat(document.getElementById("editFuelAmount").value),
      fuelPrice: parseFloat(document.getElementById("editFuelPrice").value),
      fuelType: parseInt(document.getElementById("editFuelType").value),
      gasStation: document.getElementById("editGasStation").value,
      mileageAtRefuel: parseInt(
        document.getElementById("editMileageAtRefuel").value,
      ),
      invoiceLink: document.getElementById("editInvoiceLink").value || null,
    }),
  }).then(async (response) => {
    if (response.ok) {
      refreshTable();
      editModal.hide();
    }
  });
}
