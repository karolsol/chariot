<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { validate } from "class-validator";
import { plainToInstance } from "class-transformer";
import { CreateUserDto } from "@chariot/shared";
import axios from "axios";

const router = useRouter();

const errorMessage = ref("");
const errors = ref<Record<string, string>>({});
const username = ref("");
const password = ref("");
const confirmPassword = ref("");

const handleRegister = async () => {
  errors.value = {};
  errorMessage.value = "";

  const dtoInstance = plainToInstance(CreateUserDto, {
    username: username.value,
    password: password.value,
  });

  const validationErrors = await validate(dtoInstance);

  if (validationErrors.length > 0) {
    validationErrors.forEach((err) => {
      if (err.property && err.constraints) {
        errors.value[err.property] = Object.values(err.constraints)[0];
      }
    });
    if (Object.keys(errors.value).length > 0) {
      return;
    }
  }

  if (password.value != confirmPassword.value) {
    errorMessage.value = "Passwords do not match";
    return;
  }
  try {
    await axios.post("/api/users", {
      username: username.value,
      password: password.value,
    });
    router.push("/login");
  } catch (error) {
    if (axios.isAxiosError(error)) {
      switch (error.response?.status) {
        case 409:
          errorMessage.value = "This username is already taken";
          break;
        case 403:
          errorMessage.value = "Registration disabled. See docs if that is not intentional";
          break;
        default:
          errorMessage.value = `Server error: (${error.response?.status}). Try again later.`;
      }
    } else {
      errorMessage.value = "Can't connect to server try again later";
    }
    console.error("Registration error:", error);
  }
};
</script>
<template>
  <div class="container">
    <div class="row justify-content-center align-items-center min-vh-100">
      <div class="col-md-6 col-lg-4">
        <div class="card shadow">
          <div class="card-body p-5">
            <h3 class="card-title text-center mb-4">Register</h3>
            <div v-if="errorMessage" class="alert alert-danger" role="alert">
              {{ errorMessage }}
            </div>
            <form @submit.prevent="handleRegister">
              <div class="mb-3">
                <label for="username" class="form-label">Username</label>
                <input
                  type="text"
                  class="form-control"
                  :class="{ 'is-invalid': errors.username }"
                  id="username"
                  v-model="username"
                  required
                />
                <div class="invalid-feedback" v-if="errors.username">
                  {{ errors.username }}
                </div>
              </div>
              <div class="mb-3">
                <label for="password" class="form-label">Password</label>
                <input
                  type="password"
                  class="form-control"
                  :class="{ 'is-invalid': errors.password }"
                  id="password"
                  v-model="password"
                  required
                />
                <div class="invalid-feedback" v-if="errors.password">
                  {{ errors.password }}
                </div>
              </div>
              <div class="mb-3">
                <label for="confirmPassword" class="form-label"
                  >Confirm Password</label
                >
                <input
                  type="password"
                  class="form-control"
                  id="confirmPassword"
                  v-model="confirmPassword"
                  required
                />
              </div>
              <button
                type="submit"
                class="btn btn-primary w-100"
                id="registerButton"
              >
                Register
              </button>
            </form>
            <p class="text-center mt-3 mb-0">
              Already have an account?
              <router-link to="/login">Login here</router-link>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
