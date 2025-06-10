import { supabase } from "../utils/supabase";

export const getAuthenticatedUser = async (token: string) => {
	if (!token.startsWith("Bearer ")) {
		throw { status: 401, message: "Missing or invalid Authorization header" };
	}

	const parsedToken = token.split(" ")[1];
	const { data, error } = await supabase.auth.getUser(parsedToken);
	if (error || !data.user) {
		throw { status: 401, message: "Invalid or expired token" };
	}

	const { data: userRow, error: userError } = await supabase
		.from("users")
		.select("id, email")
		.eq("auth_user_id", data.user.id)
		.single();

	if (userError || !userRow) {
		throw { status: 404, message: "User not found in users table" };
	}

	return userRow;
};
