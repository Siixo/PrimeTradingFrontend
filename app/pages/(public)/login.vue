<template>
  <div
    class="min-h-screen bg-gray-100 dark:bg-gray-950 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8"
  >
    <div class="max-w-sm w-full space-y-8">
      <UCard class="shadow-xl border border-gray-200 dark:border-gray-700">
        <div class="text-center m-8">
          <UIcon
            name="i-heroicons-arrow-right-on-rectangle"
            class="mx-auto h-12 w-12 text-primary-600"
            aria-hidden="true"
          />
          <h1
            class="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white"
          >
            Welcome back
          </h1>
          <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Sign in to your PrimeTrading account
          </p>
        </div>

        <div
          v-if="errorMessage"
          role="alert"
          class="mb-4 p-3 rounded-md bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-sm text-center"
        >
          {{ errorMessage }}
        </div>

        <form
          class="space-y-6 flex flex-col justify-center"
          @submit.prevent="onLogin"
          aria-label="Sign in form"
        >
          <UFormGroup
            label="Username or Email"
            name="identifier"
            help="Enter your username or email"
            class="text-center"
          >
            <UInput
              v-model="identifier"
              placeholder="Enter your username or email"
              icon="i-heroicons-user"
              size="xl"
              class="text-center"
              required
              autocomplete="username"
              aria-required="true"
            />
          </UFormGroup>

          <UFormGroup label="Password" name="password" class="text-center">
            <UInput
              v-model="password"
              type="password"
              placeholder="Enter your password"
              icon="i-heroicons-lock-closed"
              size="xl"
              class="text-center"
              required
              autocomplete="current-password"
              aria-required="true"
            />
          </UFormGroup>

          <div class="flex items-center justify-between">
            <UCheckbox label="Remember me" />
            <UButton
              variant="link"
              size="sm"
              to="/forgot-password"
              class="p-0 text-sm"
            >
              Forgot password?
            </UButton>
          </div>

          <UButton
            type="submit"
            block
            size="lg"
            :loading="loading"
            class="justify-center mx-auto w-full"
          >
            <template #leading>
              <UIcon
                name="i-heroicons-arrow-right-on-rectangle"
                aria-hidden="true"
              />
            </template>
            Sign In
          </UButton>
        </form>

        <div class="mt-6 text-center">
          <p class="text-sm text-gray-600 dark:text-gray-400">
            Don't have an account?
            <UButton variant="link" size="sm" to="/register" class="p-0">
              Create one here
            </UButton>
          </p>
        </div>
      </UCard>
    </div>
  </div>
</template>

<script setup lang="ts">
const { login, user } = useAuth();
const router = useRouter();

useHead({
  title: "Login - PrimeTrading",
  meta: [
    {
      name: "description",
      content:
        "Sign in to your PrimeTrading account and continue your trading journey.",
    },
  ],
});

const identifier = ref("");
const password = ref("");
const loading = ref(false);
const errorMessage = ref("");

watch(
  user,
  (u) => {
    if (u) router.push("/graphs");
  },
  { immediate: true },
);

async function onLogin() {
  errorMessage.value = "";
  if (!identifier.value.trim()) {
    errorMessage.value = "Please enter your username or email.";
    return;
  }
  if (!password.value) {
    errorMessage.value = "Please enter your password.";
    return;
  }

  loading.value = true;
  try {
    await login(identifier.value, password.value);
    router.push("/graphs");
  } catch (error: any) {
    const msg = error?.message || "";
    try {
      const parsed = JSON.parse(msg);
      errorMessage.value =
        parsed.error ||
        parsed.message ||
        "Login failed. Please check your credentials.";
    } catch {
      errorMessage.value =
        msg || "Login failed. Please check your credentials.";
    }
  } finally {
    loading.value = false;
  }
}
</script>
