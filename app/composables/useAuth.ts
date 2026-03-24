type User = {
  username: string;
  email: string;
  user_id: number;
} | null;

export const useAuth = () => {
  const user = useState<User>("user", () => null);

  const setUser = (newUser: User) => {
    user.value = newUser;
  };

  const clearUser = () => {
    user.value = null;
  };

  const fetchUser = async () => {
    try {
      const response = await fetch("/api/me", {
        method: "GET",
        credentials: "include",
      });
      if (response.ok) {
        user.value = await response.json();
      } else {
        user.value = null;
      }
    } catch {
      user.value = null;
    }
  };

  const logout = async () => {
    try {
      await fetch("/api/logout", {
        method: "POST",
        credentials: "include",
      });
    } finally {
      clearUser();
      navigateTo("/login");
    }
  };

  return {
    user,
    setUser,
    clearUser,
    fetchUser,
    logout,
  };
};
