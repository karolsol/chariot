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
      <label for="editEntryVehicle" class="form-label">Vehicle</label>
      <select
        v-autofocus
        class="form-select form-select-sm"
        :class="{ 'is-invalid': errors.vehicleId }"
        v-model="form.vehicleId"
        id="editEntryVehicle"
      >
        <option value="" hidden>Select Vehicle</option>
        <option
          v-for="vehicle in props.vehicles"
          :key="vehicle.id"
          :value="vehicle.id"
        >
          {{ vehicle.make }} {{ vehicle.model }}
        </option>
      </select>
      <div class="invalid-feedback" v-if="errors.vehicleId">
        {{ errors.vehicleId }}
      </div>
    </div>
    <div class="col-md-6 mb-3">
      <label for="editDate" class="form-label">Date</label>
      <input
        type="date"
        class="form-control form-control-sm"
        :class="{ 'is-invalid': errors.date }"
        v-model="formattedDate"
        id="editDate"
        required
      />
      <div class="invalid-feedback" v-if="errors.date">{{ errors.date }}</div>
    </div>
  </div>
  <div class="row">
    <div class="col-md-6 mb-3">
      <label for="editFuelAmount" class="form-label">Fuel amount</label>
      <input
        type="number"
        class="form-control form-control-sm"
        :class="{ 'is-invalid': errors.fuelAmount }"
        v-model.number="form.fuelAmount"
        id="editFuelAmount"
        required
      />
      <div class="invalid-feedback" v-if="errors.fuelAmount">
        {{ errors.fuelAmount }}
      </div>
    </div>
    <div class="col-md-6 mb-3">
      <label for="editFuelPrice" class="form-label">Fuel price</label>
      <input
        type="number"
        class="form-control form-control-sm"
        :class="{ 'is-invalid': errors.fuelPrice }"
        v-model.number="form.fuelPrice"
        id="editFuelPrice"
        required
      />
      <div class="invalid-feedback" v-if="errors.fuelPrice">
        {{ errors.fuelPrice }}
      </div>
    </div>
  </div>
  <div class="row">
    <div class="col-md-6 mb-3">
      <label for="editFuelType" class="form-label">Fuel type</label>
      <select
        class="form-select form-select-sm"
        :class="{ 'is-invalid': errors.fuelType }"
        v-model.number="form.fuelType"
        id="editFuelType"
        required
      >
        <option value="" hidden>Select fuel type</option>
        <option value="0">Gasoline</option>
        <option value="1">Diesel</option>
        <option value="2">Electricity</option>
      </select>
      <div class="invalid-feedback" v-if="errors.fuelType">
        {{ errors.fuelType }}
      </div>
    </div>
    <div class="col-md-6 mb-3">
      <label for="editMileageAtRefuel" class="form-label">Mileage</label>
      <input
        type="number"
        class="form-control form-control-sm"
        :class="{ 'is-invalid': errors.mileageAtRefuel }"
        v-model.number="form.mileageAtRefuel"
        id="editMileageAtRefuel"
        required
      />
      <div class="invalid-feedback" v-if="errors.mileageAtRefuel">
        {{ errors.mileageAtRefuel }}
      </div>
    </div>
  </div>
  <div class="mb-3">
    <label for="editGasStation" class="form-label">Gas station</label>
    <input
      type="text"
      class="form-control form-control-sm"
      :class="{ 'is-invalid': errors.gasStation }"
      v-model="form.gasStation"
      id="editGasStation"
      required
    />
    <div class="invalid-feedback" v-if="errors.gasStation">
      {{ errors.gasStation }}
    </div>
  </div>
  <div class="mb-3">
    <label for="editInvoiceLink" class="form-label">Invoice link</label>
    <input
      type="text"
      class="form-control form-control-sm"
      :class="{ 'is-invalid': errors.invoiceLink }"
      v-model="form.invoiceLink"
      id="editInvoiceLink"
      required
    />
    <div class="invalid-feedback" v-if="errors.invoiceLink">
      {{ errors.invoiceLink }}
    </div>
  </div>
</template>
