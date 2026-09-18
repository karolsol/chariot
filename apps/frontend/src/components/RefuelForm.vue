<script setup lang="ts">
import { computed, type PropType, ref } from "vue";
import { validate } from "class-validator";
import { plainToInstance } from "class-transformer";
import { CreateRefuelDto, type IRefuel, type IVehicle } from "@chariot/shared";
import { UpdateRefuelDto } from "@chariot/shared";

const form = defineModel<Partial<IRefuel>>({ required: true });
const props = defineProps({
  vehicles: {
    type: Array as PropType<IVehicle[]>,
    required: true,
  },
  isEdit: {
    type: Boolean,
    default: false,
  },
});

const errors = ref<Record<string, string>>({});

const validateForm = async (): Promise<boolean> => {
  errors.value = {};

  const submitData = { ...form.value };
  submitData.date = formattedDate.value;

  const dtoClass = props.isEdit ? UpdateRefuelDto : CreateRefuelDto;
  const dtoInstance = plainToInstance(dtoClass, submitData);

  const validationErrors = await validate(dtoInstance);

  if (validationErrors.length > 0) {
    validationErrors.forEach((err) => {
      if (err.property && err.constraints) {
        errors.value[err.property] = Object.values(err.constraints)[0];
      }
    });
    return false;
  }

  return true;
};

defineExpose({ validateForm });

const formattedDate = computed({
  get() {
    if (form.value.date && form.value.date instanceof Date) {
      return form.value.date.toISOString().split("T")[0];
    } else {
      form.value.date! = new Date();
      return new Date().toISOString().split("T")[0];
    }
  },
  set(newValue) {
    if (newValue) {
      form.value.date! = new Date(newValue);
    }
  },
});
</script>

<template>
  <div class="row">
    <div class="col-md-6 mb-3">
      <label
        for="editEntryVehicle"
        class="form-label"
      >Vehicle</label>
      <select
        id="editEntryVehicle"
        v-model="form.vehicleId"
        v-autofocus
        class="form-select form-select-sm"
        :class="{ 'is-invalid': errors.vehicleId }"
      >
        <option
          value=""
          hidden
        >
          Select Vehicle
        </option>
        <option
          v-for="vehicle in props.vehicles"
          :key="vehicle.id"
          :value="vehicle.id"
        >
          {{ vehicle.make }} {{ vehicle.model }}
        </option>
      </select>
      <div
        v-if="errors.vehicleId"
        class="invalid-feedback"
      >
        {{ errors.vehicleId }}
      </div>
    </div>
    <div class="col-md-6 mb-3">
      <label
        for="editDate"
        class="form-label"
      >Date</label>
      <input
        id="editDate"
        v-model="formattedDate"
        type="date"
        class="form-control form-control-sm"
        :class="{ 'is-invalid': errors.date }"
        required
      >
      <div
        v-if="errors.date"
        class="invalid-feedback"
      >
        {{ errors.date }}
      </div>
    </div>
  </div>
  <div class="row">
    <div class="col-md-6 mb-3">
      <label
        for="editFuelAmount"
        class="form-label"
      >Fuel amount</label>
      <input
        id="editFuelAmount"
        v-model.number="form.fuelAmount"
        type="number"
        class="form-control form-control-sm"
        :class="{ 'is-invalid': errors.fuelAmount }"
        required
      >
      <div
        v-if="errors.fuelAmount"
        class="invalid-feedback"
      >
        {{ errors.fuelAmount }}
      </div>
    </div>
    <div class="col-md-6 mb-3">
      <label
        for="editFuelPrice"
        class="form-label"
      >Fuel price</label>
      <input
        id="editFuelPrice"
        v-model.number="form.fuelPrice"
        type="number"
        class="form-control form-control-sm"
        :class="{ 'is-invalid': errors.fuelPrice }"
        required
      >
      <div
        v-if="errors.fuelPrice"
        class="invalid-feedback"
      >
        {{ errors.fuelPrice }}
      </div>
    </div>
  </div>
  <div class="row">
    <div class="col-md-6 mb-3">
      <label
        for="editFuelType"
        class="form-label"
      >Fuel type</label>
      <select
        id="editFuelType"
        v-model.number="form.fuelType"
        class="form-select form-select-sm"
        :class="{ 'is-invalid': errors.fuelType }"
        required
      >
        <option
          value=""
          hidden
        >
          Select fuel type
        </option>
        <option value="0">
          Gasoline
        </option>
        <option value="1">
          Diesel
        </option>
        <option value="2">
          Electricity
        </option>
      </select>
      <div
        v-if="errors.fuelType"
        class="invalid-feedback"
      >
        {{ errors.fuelType }}
      </div>
    </div>
    <div class="col-md-6 mb-3">
      <label
        for="editMileageAtRefuel"
        class="form-label"
      >Mileage</label>
      <input
        id="editMileageAtRefuel"
        v-model.number="form.mileageAtRefuel"
        type="number"
        class="form-control form-control-sm"
        :class="{ 'is-invalid': errors.mileageAtRefuel }"
        required
      >
      <div
        v-if="errors.mileageAtRefuel"
        class="invalid-feedback"
      >
        {{ errors.mileageAtRefuel }}
      </div>
    </div>
  </div>
  <div class="mb-3">
    <label
      for="editGasStation"
      class="form-label"
    >Gas station</label>
    <input
      id="editGasStation"
      v-model="form.gasStation"
      type="text"
      class="form-control form-control-sm"
      :class="{ 'is-invalid': errors.gasStation }"
      required
    >
    <div
      v-if="errors.gasStation"
      class="invalid-feedback"
    >
      {{ errors.gasStation }}
    </div>
  </div>
  <div class="mb-3">
    <label
      for="editInvoiceLink"
      class="form-label"
    >Invoice link</label>
    <input
      id="editInvoiceLink"
      v-model="form.invoiceLink"
      type="text"
      class="form-control form-control-sm"
      :class="{ 'is-invalid': errors.invoiceLink }"
      required
    >
    <div
      v-if="errors.invoiceLink"
      class="invalid-feedback"
    >
      {{ errors.invoiceLink }}
    </div>
  </div>
</template>
