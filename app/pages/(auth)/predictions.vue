<template>
  <h1>Oui</h1>
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
});
</script>
