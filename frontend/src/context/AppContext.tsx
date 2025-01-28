"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

interface AppContextType {
	user: string | null;
	setUser: (user: string | null) => void;
	logout: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppContextProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const [user, setUser] = useState<string | null>(null);

	// Restore user and token from localStorage on initialization
	useEffect(() => {
		const savedUser = localStorage.getItem("user");

		if (savedUser) {
			setUser(JSON.parse(savedUser));
		}
	}, []);

	// Persist user to localStorage whenever it changes
	useEffect(() => {
		if (user) {
			localStorage.setItem("user", JSON.stringify(user));
		} else {
			localStorage.removeItem("user");
		}
	}, [user]);

	const logout = () => {
		setUser(null);
		localStorage.removeItem("user");
	};

	return (
		<AppContext.Provider value={{ user, setUser, logout }}>
			{children}
		</AppContext.Provider>
	);
};

export const useAppContext = () => {
	const context = useContext(AppContext);
	if (!context) {
		throw new Error(
			"useAppContext must be used within an AppContextProvider"
		);
	}
	return context;
};
