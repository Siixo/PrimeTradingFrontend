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
      const response = await fetch("http://127.0.0.1:8080/api/me", {
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

  return {
    user,
    setUser,
    clearUser,
    fetchUser,
  };
};
