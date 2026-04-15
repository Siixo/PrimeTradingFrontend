import { apiFetch } from "~/composables/useApi";

export type User = {
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
      user.value = await apiFetch<NonNullable<User>>("/api/me");
    } catch {
      user.value = null;
    }
  };

  const login = async (identifier: string, password: string) => {
    const data = await apiFetch<NonNullable<User>>("/api/login", {
      method: "POST",
      body: JSON.stringify({ identifier, password }),
    });
    user.value = data;
    return data;
  };

  const register = async (payload: {
    username: string;
    email: string;
    password: string;
    password2: string;
  }) => {
    await apiFetch<{ message: string }>("/api/register", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  };

  const changePassword = async (oldPassword: string, newPassword: string) => {
    await apiFetch<{ message: string }>("/api/user/change-password", {
      method: "POST",
      body: JSON.stringify({
        old_password: oldPassword,
        new_password: newPassword,
      }),
    });
  };

  const logout = async () => {
    try {
      await apiFetch<void>("/api/logout", { method: "POST" });
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
    login,
    register,
    changePassword,
    logout,
  };
};
