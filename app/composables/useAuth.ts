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
      const response = await fetch(
        "http://ec2-35-180-31-240.eu-west-3.compute.amazonaws.com:443/api/me",
        {
          method: "GET",
          credentials: "include",
        }
      );
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
