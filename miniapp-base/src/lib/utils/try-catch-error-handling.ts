/**
 * @notice - Extracts the error message in a string format from an unknown error object.
 * @dev - This function is used in a try-catch block.
 */
export function extractErrorMessageInString(error: unknown): string {
  if (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof (error as { message?: unknown }).message === "string"
  ) {
    return (error as { message: string }).message;
  }
  
  // Fallback to string conversion
  return String(error);
}
