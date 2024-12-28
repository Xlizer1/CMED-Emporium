"use client";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setTheme } from "@/store/Slices/themeSlice";

export default function ThemeInitializer() {
    const dispatch = useDispatch();

    useEffect(() => {
        const savedTheme = localStorage.getItem("theme");
        if (savedTheme) {
            dispatch(setTheme(savedTheme));
        }
    }, [dispatch]);

    return null;
}
