export function logError(context: string, error: unknown) {
	if (error instanceof Error) {
		console.error(`❌ [${context}] ${error.message}`);
	} else {
		console.error(`❌ [${context}] Unknown error:`, error);
	}
}
