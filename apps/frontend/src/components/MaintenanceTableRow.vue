<script setup lang="ts">
import type { PropType } from "vue";
import type { IMaintenance, IVehicle } from "@chariot/shared";

const props = defineProps({
  maintenance: {
    type: Object as PropType<IMaintenance>,
    required: true,
  },
});

const emits = defineEmits<{
  (e: "delete", id: string): void;
  (e: "edit", id: string): void;
}>();

const onEdit = (): void => {
  emits("edit", props.maintenance.id);
};

const onDelete = (): void => {
  emits("delete", props.maintenance.id);
};

const getVehicleName = (vehicle: IVehicle) => {
  return `${vehicle.make} ${vehicle.model}`;
};
</script>

<template>
  <tr>
    <td>{{ getVehicleName(props.maintenance?.vehicle) }}</td>
    <td>{{ props.maintenance.title }}</td>
    <td>{{ new Date(props.maintenance.date).toLocaleDateString() }}</td>
    <td>{{ props.maintenance.mileage }} km</td>
    <td>{{ props.maintenance.cost }}</td>
    <td>
      <a
        target="_blank"
        class="btn btn-sm btn-outline-secondary"
        v-if="props.maintenance.invoiceLink"
        :href="props.maintenance.invoiceLink"
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
