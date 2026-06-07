<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { validate } from "class-validator";
import { plainToInstance } from "class-transformer";
import { CreateUserDto } from "../../../../libs/shared/src/create-user.dto.ts";

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
  fetch("/api/users", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username: username.value,
      password: password.value,
    }),
  })
    .then(async (response) => {
      if (response.ok) {
        const data = await response.json();
        console.log(data);
        router.push("/login");
      } else {
        errorMessage.value = "Username already taken";
      }
    })
    .catch((error) => {
      console.error("Registration error:", error);
      errorMessage.value = "An error occurred during registration. Please try again.";
    });
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
