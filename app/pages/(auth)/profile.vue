<script setup lang="ts">
import { useAuth } from "~/composables/useAuth";

definePageMeta({ middleware: "auth" });

const { user, logout } = useAuth();

const initials = computed(() => {
  if (!user.value?.username) return "?";
  return user.value.username.charAt(0).toUpperCase();
});
</script>

<template>
  <div class="py-12 px-6 max-w-4xl mx-auto min-h-screen">
    <div class="mb-12 flex items-center gap-6">
      <UAvatar
        :alt="user?.username"
        size="3xl"
        class="bg-primary text-white font-bold text-2xl"
      >
        {{ initials }}
      </UAvatar>
      <div>
        <h1 class="text-3xl font-bold">Welcome, {{ user?.username }}!</h1>
        <p class="text-gray-500">Manage your account and preferences.</p>
      </div>
    </div>

    <div class="grid md:grid-cols-3 gap-8">
      <!-- Account Details -->
      <UCard class="md:col-span-2">
        <template #header>
          <div class="flex items-center gap-2">
            <UIcon name="i-heroicons-user" class="h-5 w-5 text-primary" />
            <h2 class="font-bold">Account Details</h2>
          </div>
        </template>

        <div class="space-y-6">
          <div class="flex justify-between items-center py-2 border-b border-gray-800">
            <span class="text-gray-400">Username</span>
            <span class="font-medium font-mono text-gray-200">{{
              user?.username
            }}</span>
          </div>
          <div class="flex justify-between items-center py-2 border-b border-gray-800">
            <span class="text-gray-400">Email Address</span>
            <span class="font-medium text-gray-200">{{ user?.email }}</span>
          </div>
          <div class="flex justify-between items-center py-2">
            <span class="text-gray-400">Account ID</span>
            <span class="text-sm font-mono text-gray-500">#{{ user?.user_id }}</span>
          </div>
        </div>

        <template #footer>
          <p class="text-xs text-gray-600 italic">
            Joined our community to explore commodity correlations.
          </p>
        </template>
      </UCard>

      <!-- Actions -->
      <div class="space-y-4">
        <UCard>
          <h3 class="font-bold mb-4">Security</h3>
          <UButton
            color="neutral"
            variant="outline"
            block
            label="Change Password"
            disabled
          />
        </UCard>

        <UButton
          color="error"
          variant="soft"
          block
          icon="i-heroicons-arrow-left-on-rectangle"
          label="Log Out"
          class="mt-8"
          @click="logout"
        />
      </div>
    </div>
  </div>
</template>
