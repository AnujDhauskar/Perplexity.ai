import { useDispatch } from "react-redux";
import { register, login, getMe } from "../service/auth.api";
import { setUser, setLoading, setError } from "../auth.slice";
import { useCallback } from "react";

const AUTH_STORAGE_KEY = "auth_user";

export function useAuth() {


    const dispatch = useDispatch()

    const saveUserToStorage = useCallback((user) => {
        if (!user) return;
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    }, []);

    const clearUserFromStorage = useCallback(() => {
        localStorage.removeItem(AUTH_STORAGE_KEY);
    }, []);

    const hydrateUserFromStorage = useCallback(() => {
        const storedUser = localStorage.getItem(AUTH_STORAGE_KEY);
        if (!storedUser) return;

        try {
            dispatch(setUser(JSON.parse(storedUser)));
        } catch {
            clearUserFromStorage();
        }
    }, [clearUserFromStorage, dispatch]);

    const handleRegister = useCallback(async ({ email, username, password }) => {
        try {
            dispatch(setLoading(true))
            await register({ email, username, password })
            return true;
        } catch (error) {
            dispatch(setError(error.response?.data?.message || "Registration failed"))
            return false;
        } finally {
            dispatch(setLoading(false))
        }
    }, [dispatch])

    const handleLogin = useCallback(async ({ email, password }) => {
        try {
            dispatch(setLoading(true))
            const data = await login({ email, password })
            if (!data?.user) {
                dispatch(setError("Login failed"))
                return false;
            }
            dispatch(setUser(data.user))
            saveUserToStorage(data.user);
            dispatch(setError(null))
            return true;
        } catch (err) {
            dispatch(setError(err.response?.data?.message || "Login failed"))
            return false;
        } finally {
            dispatch(setLoading(false))
        }
    }, [dispatch, saveUserToStorage])

    const handleGetMe = useCallback(async () => {
        try {
            dispatch(setLoading(true))
            const data = await getMe()
            dispatch(setUser(data.user))
            saveUserToStorage(data.user);
            dispatch(setError(null))
            return true;
        } catch (err) {
            dispatch(setError(err.response?.data?.message || "Failed to fetch user data"))
            dispatch(setUser(null))
            clearUserFromStorage();
            return false;
        } finally {
            dispatch(setLoading(false))
        }
    }, [clearUserFromStorage, dispatch, saveUserToStorage])

    return {
        handleRegister,
        handleLogin,
        handleGetMe,
        hydrateUserFromStorage
    }

}
