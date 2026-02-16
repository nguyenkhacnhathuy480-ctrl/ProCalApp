// SECURITY UTILITIES
// Used to obfuscate codes and verify local storage integrity

const SALT = "_PROFIT_SECURE_2024";

/**
 * Creates a hash of the input string using a simple obfuscation algorithm.
 * Algorithm: Base64(Reverse(Input) + Salt)
 * This prevents plain text search in the source code.
 */
export const hashString = (str: string): string => {
  try {
    const reversed = str.trim().toUpperCase().split('').reverse().join('');
    return btoa(reversed + SALT);
  } catch (e) {
    console.error("Hashing error", e);
    return "";
  }
};

/**
 * Generates a signed token to store in localStorage.
 * This prevents users from simply setting "isPro = true" in the console.
 */
export const generateSecureToken = (): string => {
  const payload = {
    status: 'active',
    timestamp: Date.now(),
    device: navigator.userAgent.slice(0, 20) // Simple device binding
  };
  
  const payloadStr = JSON.stringify(payload);
  const signature = hashString(payloadStr); // Sign the payload
  
  // Return Base64 of the entire package
  return btoa(JSON.stringify({ payload: payloadStr, signature }));
};

/**
 * Verifies if the stored token is valid and hasn't been tampered with.
 */
export const verifySecureToken = (token: string | null): boolean => {
  if (!token) return false;

  try {
    // 1. Decode the package
    const decodedPackage = JSON.parse(atob(token));
    const { payload, signature } = decodedPackage;

    // 2. Re-calculate signature
    const calculatedSig = hashString(payload);

    // 3. Compare signatures
    return calculatedSig === signature;
  } catch (e) {
    return false;
  }
};