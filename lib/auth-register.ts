import { ApiError, apiClient, setAuthToken } from "@/lib/api-client";

export const REGISTER_ROLE_IDS = {
  mentor: 1,
  mentee: 2,
  trainer: 3,
} as const;

export type RegisterUserPayload = {
  name: string;
  email: string;
  password: string;
  roleId: number;
};

type RegisterResponse = {
  success?: boolean;
  error?: string;
  message?: string;
  token?: string;
  accessToken?: string;
  user?: Record<string, unknown>;
  data?: {
    success?: boolean;
    error?: string;
    message?: string;
    token?: string;
    accessToken?: string;
    user?: Record<string, unknown>;
  };
};

const resolveRegisterToken = (payload: RegisterResponse) =>
  payload.token ??
  payload.accessToken ??
  payload.data?.token ??
  payload.data?.accessToken;

const resolveRegisterUser = (payload: RegisterResponse) =>
  payload.user ?? payload.data?.user ?? null;

export const registerUser = async (payload: RegisterUserPayload) => {
  const response = await apiClient.post<RegisterResponse, RegisterUserPayload>(
    "/auth/register",
    payload,
    { withAuth: false },
  );

  if (response.success === false || response.data?.success === false) {
    throw new Error(
      response.error ??
        response.data?.error ??
        response.message ??
        response.data?.message ??
        "Unable to create account.",
    );
  }

  const token = resolveRegisterToken(response);
  if (token) {
    setAuthToken(token);
  }

  const user = resolveRegisterUser(response);
  if (typeof window !== "undefined" && user) {
    try {
      window.localStorage.setItem("user", JSON.stringify(user));
    } catch {
      // Ignore storage errors without blocking signup.
    }
  }

  return response;
};

export { ApiError };
