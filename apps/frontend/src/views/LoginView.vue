<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const username = ref("");
const password = ref("");
const errorMessage = ref("");
const handleLogin = async () => {
  if (!username.value || !password.value) {
    errorMessage.value = "Please enter both username and password";
    return;
  }
  fetch("/api/auth/login", {
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
      localStorage.setItem("access_token", data.access_token);

      router.push("/dashboard");
    } else {
      errorMessage.value = "Incorrect username or password";
    }
  })
  .catch((error) => {
    console.error("Login error:", error);
    errorMessage.value = "An error occurred during login. Please try again.";
  });
};
</script>

<template>
  <div class="container">
    <div class="row justify-content-center align-items-center min-vh-100">
      <div class="col-md-6 col-lg-4">
        <div class="card shadow">
          <div class="card-body p-5">
            <h3 class="card-title text-center mb-4">Login</h3>

            <div v-if="errorMessage" class="alert alert-danger" role="alert">
              {{ errorMessage }}
            </div>

            <form @submit.prevent="handleLogin">
              <div class="mb-3">
                <label for="username" class="form-label">Username</label>
                <input
                  v-model="username"
                  type="text"
                  class="form-control"
                  id="username"
                  required
                />
              </div>
              <div class="mb-3">
                <label for="password" class="form-label">Password</label>
                <input
                  v-model="password"
                  type="password"
                  class="form-control"
                  id="password"
                  required
                />
              </div>
              <button type="submit" class="btn btn-primary w-100">Login</button>
            </form>

            <p class="text-center mt-3 mb-0">
              Not registered?
              <router-link to="/register">Create account</router-link>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
