<script setup lang="ts">
import { useAuth } from "~/composables/useAuth";

definePageMeta({ middleware: "auth" });

const { user, logout, changePassword } = useAuth();
const toast = useToast();

const isChangingPassword = ref(false);
const passwordState = reactive({
  old_password: "",
  new_password: "",
  confirm_password: "",
});
const isSubmitting = ref(false);

const initials = computed(() => {
  if (!user.value?.username) return "?";
  return user.value.username.charAt(0).toUpperCase();
});

async function onChangePassword() {
  if (passwordState.new_password !== passwordState.confirm_password) {
    toast.add({
      title: "Error",
      description: "New passwords do not match",
      color: "error",
    });
    return;
  }

  isSubmitting.value = true;
  try {
    await changePassword(
      passwordState.old_password,
      passwordState.new_password,
    );
    toast.add({
      title: "Success",
      description: "Password updated successfully",
      color: "success",
    });
    isChangingPassword.value = false;
    passwordState.old_password = "";
    passwordState.new_password = "";
    passwordState.confirm_password = "";
  } catch (err: any) {
    const msg = err?.message || "";
    let description = "Failed to update password";
    try {
      const parsed = JSON.parse(msg);
      description = parsed.error || parsed.message || description;
    } catch {
      if (msg) description = msg;
    }
    toast.add({
      title: "Error",
      description,
      color: "error",
    });
  } finally {
    isSubmitting.value = false;
  }
}
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
          <div
            class="flex justify-between items-center py-2 border-b border-gray-800"
          >
            <span class="text-gray-400">Username</span>
            <span class="font-medium font-mono text-gray-200">{{
              user?.username
            }}</span>
          </div>
          <div class="flex justify-between items-center py-2">
            <span class="text-gray-400">Email Address</span>
            <span class="font-medium text-gray-200">{{ user?.email }}</span>
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
        <UCard v-if="!isChangingPassword">
          <h3
            class="font-bold mb-4 text-sm text-gray-400 uppercase tracking-wider"
          >
            Security
          </h3>
          <UButton
            color="neutral"
            variant="outline"
            block
            icon="i-heroicons-key"
            label="Change Password"
            @click="isChangingPassword = true"
          />
        </UCard>

        <!-- Change Password Form -->
        <UCard v-else class="ring-1 ring-primary/30">
          <template #header>
            <div class="flex justify-between items-center">
              <h3 class="font-bold">Change Password</h3>
              <UButton
                color="neutral"
                variant="ghost"
                icon="i-heroicons-x-mark"
                size="xs"
                aria-label="Cancel password change"
                @click="isChangingPassword = false"
              />
            </div>
          </template>

          <UForm
            :state="passwordState"
            class="space-y-4"
            @submit="onChangePassword"
          >
            <UFormField label="Current Password" name="old_password">
              <UInput
                v-model="passwordState.old_password"
                type="password"
                placeholder="••••••••"
                autocomplete="current-password"
                aria-required="true"
              />
            </UFormField>
            <UFormField label="New Password" name="new_password">
              <UInput
                v-model="passwordState.new_password"
                type="password"
                placeholder="••••••••"
                autocomplete="new-password"
                aria-required="true"
              />
            </UFormField>
            <UFormField label="Confirm New Password" name="confirm_password">
              <UInput
                v-model="passwordState.confirm_password"
                type="password"
                placeholder="••••••••"
                autocomplete="new-password"
                aria-required="true"
              />
            </UFormField>

            <div class="flex flex-col gap-2 pt-2">
              <UButton
                type="submit"
                block
                color="primary"
                :loading="isSubmitting"
                label="Update Password"
              />
              <UButton
                variant="ghost"
                block
                color="neutral"
                label="Cancel"
                @click="isChangingPassword = false"
              />
            </div>
          </UForm>
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
