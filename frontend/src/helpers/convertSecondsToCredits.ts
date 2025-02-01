export const convertSecondsToCredits = (seconds: number): number => {
	return Math.round(seconds / 60); // Rounds up to ensure every partial minute is counted
};
