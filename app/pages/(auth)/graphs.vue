<template>
  <div>
    <div
      ref="chartContainer"
      class="w-150 h-75 mx-auto border border-gray-300"
    />
  </div>
</template>

<script lang="js" setup>
const router = useRouter();
const { user, fetchUser } = useAuth(); // Use the global auth composable

onMounted(async () => {
  if (!user.value) {
    await fetchUser();
  }

  if (!user.value) {
    router.push('/login');
  }

  // Sample data for the chart
});
</script>
