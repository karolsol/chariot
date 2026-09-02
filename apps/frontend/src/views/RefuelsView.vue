<script setup lang="ts">
import { h, ref, watch } from "vue";
import NoEntitiesCard from "../components/NoEntitiesCard.vue";
import ConfirmationPopup from "../components/modals/ConfirmationPopup.vue";
import { useModalStore } from "../stores/modalStore";
import AddRefuelModal from "../components/modals/AddRefuelModal.vue";
import EditRefuelModal from "../components/modals/EditRefuelModal.vue";
import {
  CreateRefuelDto,
  type IRefuel,
  type UpdateRefuelDto,
} from "@chariot/shared";
import { Icon } from "@iconify/vue";
import { useVehicles } from "../composables/useVehicles";
import { useRefuels } from "../composables/useRefuels";
import FetchingErrorCard from "../components/FetchingErrorCard.vue";
import DataTable from "../components/DataTable.vue";
import {
  createColumnHelper,
  type PaginationState,
  type SortingState,
  tableFeatures,
} from "@tanstack/vue-table";
import ActionButton from "../components/ActionButton.vue";

const selectedRefuel = ref<IRefuel>({} as IRefuel);

const vehicleFilter = ref<string | undefined>();
const dateRangeFilter = ref<string | undefined>();

const pagination = ref<PaginationState>({
  pageIndex: 0,
  pageSize: 10,
});

const sorting = ref<SortingState>([]);

watch([vehicleFilter, dateRangeFilter], () => {
  pagination.value.pageIndex = 0;
});

const modalStore = useModalStore();

const { vehicles } = useVehicles();

const {
  refuels,
  pageCount,
  isLoading,
  isError,
  addRefuel,
  editRefuel,
  removeRefuel,
} = useRefuels(vehicleFilter, dateRangeFilter, pagination, sorting);

const onCreate = () => {
  modalStore.open(AddRefuelModal, {
    props: {
      vehicles: vehicles.value,
    },
    functions: {
      submit: (createRefuelDto: CreateRefuelDto) => {
        addRefuel(createRefuelDto);
        modalStore.close();
      },
    },
  });
};
const onEdit = (id: string) => {
  selectedRefuel.value = refuels.value!.find((v) => v.id === id) as IRefuel;
  modalStore.open(EditRefuelModal, {
    props: {
      refuel: selectedRefuel.value,
      vehicles: vehicles.value,
    },
    functions: {
      submit: (id: string, refuel: UpdateRefuelDto) => {
        editRefuel({ id, payload: refuel });
        modalStore.close();
      },
    },
  });
};

const onDelete = (id: string) => {
  const foundRefuel = refuels.value?.find((v) => v.id === id);
  if (!foundRefuel) return;

  selectedRefuel.value = foundRefuel;

  modalStore.open(ConfirmationPopup, {
    props: {
      title: "Delete refuel",
      message: `Are you sure you want to delete the ${selectedRefuel.value.vehicle.make} ${selectedRefuel.value.vehicle.model} from ${new Date(selectedRefuel.value.date).toLocaleDateString()}? This action cannot be undone.`,
      confirmText: "Delete",
      cancelText: "Cancel",
      icon: "bi:exclamation-triangle-fill",
      variant: "danger",
    },
    functions: {
      submit: () => {
        removeRefuel(selectedRefuel.value.id);
        modalStore.close();
      },
    },
  });
};

const features = tableFeatures({});
const columnHelper = createColumnHelper<typeof features, IRefuel>();

const columns = [
  columnHelper.accessor((row) => `${row.vehicle.make} ${row.vehicle.model}`, {
    id: "vehicle",
    header: "Vehicle",
  }),
  columnHelper.accessor("date", {
    header: "Date",
    cell: (info) => new Date(info.getValue()).toLocaleDateString(),
  }),
  columnHelper.accessor("fuelPrice", { header: "Fuel price" }),
  columnHelper.accessor("fuelAmount", { header: "Fuel Amount" }),
  columnHelper.accessor((row) => row.fuelPrice * row.fuelAmount, {
    header: "Total Cost",
  }),
  columnHelper.accessor("mileageAtRefuel", { header: "Mileage" }),
  columnHelper.accessor("gasStation", { header: "Gas Station" }),
  columnHelper.display({
    id: "actions",
    header: "",
    cell: ({ row }) => {
      const { id, invoiceLink } = row.original;

      return h(
        "div",
        { class: "d-flex gap-2 justify-content-end" },
        [
          // Only show the invoice button if there is an invoice link
          invoiceLink &&
            h(ActionButton, {
              icon: "mdi:file-document-outline",
              variant: "secondary",
              title: "Invoice",
              onClick: () => window.open(invoiceLink, "_blank"),
            }),

          h(ActionButton, {
            icon: "mdi:pencil",
            variant: "primary",
            title: "Edit",
            onClick: () => onEdit(id),
          }),

          h(ActionButton, {
            icon: "mdi:delete",
            variant: "danger",
            title: "Delete",
            onClick: () => onDelete(id),
          }),
        ].filter(Boolean),
      );
    },
  }),
];
</script>

<template>
  <div class="container mt-5">
    <div class="row">
      <div class="col-12">
        <h2>Your refuels:</h2>
        <div class="row mb-4 align-items-end">
          <div class="col-6 col-md-3">
            <label for="vehicleFilter" class="form-label small text-muted"
              >Vehicle</label
            >
            <select
              class="form-select form-select-sm"
              id="vehicleFilter"
              v-model="vehicleFilter"
            >
              <option :value="undefined" selected>All</option>
              <option
                v-for="vehicle in vehicles"
                :key="vehicle.id"
                :value="vehicle.id"
              >
                {{ vehicle.make }} {{ vehicle.model }}
              </option>
            </select>
          </div>
          <div class="col-6 col-md-3">
            <label for="dateRange" class="form-label small text-muted"
              >Date Range</label
            >
            <select
              class="form-select form-select-sm"
              id="dateRange"
              v-model="dateRangeFilter"
            >
              <option :value="undefined" selected>All</option>
              <option value="7">Last 7 days</option>
              <option value="30">Last 30 days</option>
              <option value="365">Last Year</option>
            </select>
          </div>
          <div class="col-12 col-md-6 d-grid d-md-flex justify-content-md-end">
            <button
              class="btn btn-primary d-inline-flex align-items-center justify-content-center gap-2"
              @click="onCreate"
            >
              <Icon icon="mdi:plus" width="18" height="18" />
              Add new entry
            </button>
          </div>
        </div>

        <h4>Refueling Overview</h4>

        <DataTable
          :data="refuels ?? []"
          :columns="columns"
          :is-loading="isLoading"
          :is-error="isError"
          v-model:pagination="pagination"
          :page-count="pageCount"
          v-model:sorting="sorting"
        >
          <template #error>
            <FetchingErrorCard />
          </template>
          <template #empty>
            <NoEntitiesCard
              main-text="No refuels found"
              secondary-text="You haven't added any refuels yet."
            />
          </template>
        </DataTable>
      </div>
    </div>
  </div>
</template>