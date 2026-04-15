<script setup lang="ts">
const state = reactive({
  name: "",
  email: "",
  subject: "",
  message: "",
});

function onSubmit() {
  console.log("Form submitted:", state);
  // In a real app, you would send this to an API
  alert("Message sent! This is a demo template.");
}
</script>

<template>
  <div class="py-16 px-6 max-w-6xl mx-auto min-h-screen">
    <div class="text-center mb-16">
      <h1 class="text-5xl font-bold mb-6">Let's Connect</h1>
      <p class="text-gray-500 text-lg max-w-2xl mx-auto">
        Have questions about our commodity correlation algorithms or need custom
        analysis? Our team is ready to assist you.
      </p>
    </div>

    <div class="grid lg:grid-cols-3 gap-8">
      <!-- Contact Info Section -->
      <div class="lg:col-span-1 space-y-6">
        <UCard variant="soft" class="flex items-center gap-4">
          <div class="flex items-center gap-4 w-full">
            <UIcon
              name="i-heroicons-map-pin"
              class="h-8 w-8 text-primary shrink-0"
              aria-hidden="true"
            />
            <div>
              <p
                class="font-semibold text-sm text-gray-400 uppercase tracking-wider"
              >
                Find Us
              </p>
              <p class="font-medium">123 Market St, Paris, France</p>
            </div>
          </div>
        </UCard>

        <UCard variant="soft" class="flex items-center gap-4">
          <div class="flex items-center gap-4 w-full">
            <UIcon
              name="i-heroicons-envelope"
              class="h-8 w-8 text-primary shrink-0"
              aria-hidden="true"
            />
            <div>
              <p
                class="font-semibold text-sm text-gray-400 uppercase tracking-wider"
              >
                Email
              </p>
              <p class="font-medium">hello@primetrading.io</p>
            </div>
          </div>
        </UCard>

        <UCard variant="soft" class="flex items-center gap-4">
          <div class="flex items-center gap-4 w-full">
            <UIcon
              name="i-heroicons-phone"
              class="h-8 w-8 text-primary shrink-0"
              aria-hidden="true"
            />
            <div>
              <p
                class="font-semibold text-sm text-gray-400 uppercase tracking-wider"
              >
                Support
              </p>
              <p class="font-medium">+33 1 23 45 67 89</p>
            </div>
          </div>
        </UCard>
      </div>

      <!-- Contact Form Section -->
      <UCard class="lg:col-span-2 shadow-xl border-white/5">
        <template #header>
          <h2 class="text-xl font-bold">Send us a Message</h2>
        </template>

        <UForm
          :state="state"
          @submit="onSubmit"
          class="space-y-6"
          aria-label="Contact form"
        >
          <div class="grid sm:grid-cols-2 gap-6">
            <UFormField label="Your Name" name="name">
              <UInput
                v-model="state.name"
                placeholder="John Doe"
                size="lg"
                icon="i-heroicons-user"
              />
            </UFormField>

            <UFormField label="Email Address" name="email">
              <UInput
                v-model="state.email"
                type="email"
                placeholder="john@example.com"
                size="lg"
                icon="i-heroicons-envelope"
              />
            </UFormField>
          </div>

          <UFormField label="Subject" name="subject">
            <UInput
              v-model="state.subject"
              placeholder="How can we help?"
              size="lg"
            />
          </UFormField>

          <UFormField label="Message" name="message">
            <UTextarea
              v-model="state.message"
              :rows="5"
              placeholder="Tell us about your project or inquiry..."
              size="lg"
            />
          </UFormField>

          <UButton type="submit" block color="primary" size="xl">
            Submit Inquiry
          </UButton>
        </UForm>
      </UCard>
    </div>
  </div>
</template>

<style scoped>
/* Optional: subtle animations or glassmorphism tweaks if needed */
</style>
