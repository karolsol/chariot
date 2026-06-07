<script setup lang="ts">
import type { PropType } from "vue";
import type { Vehicle } from "../../../chariot/src/vehicle/vehicle.entity.ts";
import type { Refuel } from "../../../chariot/src/refuel/refuel.entity.ts";

const props = defineProps({
  refuel: {
    type: Object as PropType<Refuel>,
    required: true,
  },
});

const emits = defineEmits<{
  (e: "delete", id: string): void;
  (e: "edit", id: string): void;
}>();

const onEdit = (): void => {
  emits("edit", props.refuel.id);
};

const onDelete = (): void => {
  emits("delete", props.refuel.id);
};

const getVehicleName = (vehicle: Vehicle) => {
  return `${vehicle.make} ${vehicle.model}`;
};
</script>

<template>
  <tr>
    <td>{{ getVehicleName(refuel.Vehicle) }}</td>
    <td>{{ new Date(props.refuel.date).toLocaleDateString() }}</td>
    <td>{{ refuel.fuelPrice }}</td>
    <td>{{ refuel.fuelAmount }} km</td>
    <td>{{ refuel.fuelAmount * refuel.fuelPrice }}</td>
    <td>{{ refuel.mileageAtRefuel }}</td>
    <td>{{ refuel.gasStation }}</td>
    <td>
      <a
        target="_blank"
        class="btn btn-sm btn-outline-secondary"
        v-if="props.refuel.invoiceLink"
        :href="props.refuel.invoiceLink"
      >
        View Invoice
      </a>
      <span v-else class="text-muted">No invoice</span>
    </td>
    <td class="text-end">
      <button class="btn btn-sm btn-outline-primary me-2" @click="onEdit">
        Edit
      </button>
      <button class="btn btn-sm btn-outline-danger" @click="onDelete">
        Delete
      </button>
    </td>
  </tr>
</template>
