<script setup lang="ts">
import type { Vehicle } from "../../../chariot/src/vehicle/vehicle.entity.ts";
import VehicleCard from "../components/VehicleCard.vue";
import { onMounted, ref } from "vue";
import NoEntitiesCard from "../components/NoEntitiesCard.vue";
import { vehicleService } from "../services/vehiclesService.ts";
import type { CreateVehicleDto } from "../../../../libs/shared/src/create-vehicle.dto.ts";
import AddVehicleModal from "../components/AddVehicleModal.vue";
import EditVehicleModal from "../components/EditVehicleModal.vue";
import type { UpdateVehicleDto } from "../../../../libs/shared/src/update-vehicle.dto.ts";
import VehicleTypeSelector from "../components/VehicleTypeSelector.vue";
import FuelTypeSelector from "../components/FuelTypeSelector.vue";
import StatsVehicleModal from "../components/StatsVehicleModal.vue";
import type { VehicleStatsDto } from "../../../../libs/shared/src/vehicle-stats.dto.ts";
import { useModalStore } from "../stores/modalStore.ts";

let vehicles = ref<Vehicle[]>([]);

const modalStore = useModalStore();

let selectedVehicle = ref<Vehicle>({} as Vehicle);
let statusOfVehicle = ref<VehicleStatsDto>({} as VehicleStatsDto);

const addModal = ref<InstanceType<typeof AddVehicleModal> | null>(null);
const editModal = ref<InstanceType<typeof EditVehicleModal> | null>(null);
const statsModal = ref<InstanceType<typeof StatsVehicleModal> | null>(null);

const showDeleteConfirmation = ref(false);

onMounted(async () => {
  vehicles.value = await vehicleService.getAll();
});

const onEdit = (vehicle: Vehicle) => {
  selectedVehicle.value = vehicle;
  editModal.value?.show();
};

const onEditAccept = (id: string, vehicle: UpdateVehicleDto) => {
  vehicleService.update(id, vehicle).then((updatedVehicle) => {
    const index = vehicles.value.findIndex((v) => v.id === id);
    if (index !== -1) {
      vehicles.value[index] = updatedVehicle;
    }
    editModal.value?.hide();
  });
};

const onCreate = () => {
  addModal.value?.show();
};

const onCreateAccept = (createVehicleDto: CreateVehicleDto) => {
  vehicleService.create(createVehicleDto).then((newVehicle) => {
    vehicles.value.push(newVehicle);
    addModal.value?.hide();
  });
};

const onDeleteAccept = () => {
  vehicleService.delete(selectedVehicle.value.id).then(() => {
    vehicles.value = vehicles.value.filter(
      (v) => v.id !== selectedVehicle.value.id,
    );
  });
};

const onDelete = (id: string) => {
  selectedVehicle.value = vehicles.value.find((v) => v.id === id) as Vehicle;
  showDeleteConfirmation.value = true;
};

const onStats = (id: string) => {
  vehicleService.stats(id).then((stats) => {
    console.log(stats);
    modalStore.open(StatsVehicleModal, {
      stats: stats,
      icon: "oui:stats",
      title: `Stats for selected vehicle`,
      variant: "primary",
    });
  });
};
</script>

<template>
  <div class="container mt-5">
    <div class="row">
      <div class="col-12">
        <h2>Your vehicles:</h2>
        <div class="row mb-4 align-items-end">
          <div class="col-md-3">
            <VehicleTypeSelector ref="vehicleTypeSelector" />
          </div>
          <div class="col-md-3">
            <FuelTypeSelector ref="fuelTypeSelector" />
          </div>
          <div class="col-md-6 d-flex justify-content-end">
            <button
              class="btn btn-primary btn-sm"
              type="button"
              @click="onCreate"
            >
              <i class="bi bi-funnel me-1"></i>Add new entry
            </button>
          </div>
        </div>
        <div class="row g-4 mt-4" id="vehiclesCards">
          <template v-if="vehicles?.length > 0">
            <div class="col-md-4" v-for="vehicle in vehicles" :key="vehicle.id">
              <VehicleCard
                :vehicle="vehicle"
                @edit="onEdit"
                @delete="onDelete"
                @stats="onStats"
              />
            </div>
          </template>
          <NoEntitiesCard
            main-text="No vehicles found"
            secondary-text="You haven't added any vehicles to your garage yet."
            v-else
          />
        </div>
      </div>
    </div>
  </div>
  <!--  <AddVehicleModal ref="addModal" @submit="onCreateAccept" />-->
  <!--  <EditVehicleModal-->
  <!--    ref="editModal"-->
  <!--    @submit="onEditAccept"-->
  <!--    :vehicle="selectedVehicle"-->
  <!--  />-->
  <!--  &lt;!&ndash;  <StatsVehicleModal :stats="statusOfVehicle" ref="statsModal" />&ndash;&gt;-->
  <!--  <ConfirmationPopup-->
  <!--    v-model="showDeleteConfirmation"-->
  <!--    title="Delete vehicle?"-->
  <!--    :message="`Are you sure you want to delete ${selectedVehicle?.make} ${selectedVehicle?.model} (${selectedVehicle?.registrationNumber})? That operation cannot be undone.`"-->
  <!--    confirm-text="Yes, delete"-->
  <!--    cancel-text="Cancel"-->
  <!--    icon="mdi:car-off"-->
  <!--    variant="danger"-->
  <!--    @confirm="onDeleteAccept"-->
  <!--  />-->
</template>
