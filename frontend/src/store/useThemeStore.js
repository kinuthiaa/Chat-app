import toast from 'react-hot-toast';
import { create } from 'zustand'

export const useThemeStore = create((set) => ({
    theme: localStorage.getItem("chatapp-theme") || "night",
    setTheme: (theme) => {
        localStorage.setItem("chatapp-theme", theme);
        set({ theme });
        toast.success(`Theme changed to ${theme}`, {
            duration: 2000,
            position: "top-center",
            style: {backgroundColor: "var(--base-300)", color: "var(--primary)", fontSize: "1rem", padding: "1rem", borderRadius: "0.5rem",},
        });
    }
}));
