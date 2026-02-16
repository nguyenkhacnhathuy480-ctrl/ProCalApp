import { useState, useEffect } from 'react';
import { STORAGE_KEY_PRO, PRO_ACTIVATION_HASHES } from '../constants';
import { hashString, generateSecureToken, verifySecureToken } from '../utils/security';

export const usePro = () => {
  const [isPro, setIsPro] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // SECURITY CHECK: Verify token integrity instead of just reading a boolean
    const token = localStorage.getItem(STORAGE_KEY_PRO);
    const isValid = verifySecureToken(token);
    
    if (isValid) {
      setIsPro(true);
    } else {
      // If token is invalid (tampered), remove it
      if (token) localStorage.removeItem(STORAGE_KEY_PRO);
      setIsPro(false);
    }
    setLoading(false);
  }, []);

  const activatePro = (code: string): boolean => {
    // Hash the input code to compare with stored hashes
    const inputHash = hashString(code);
    
    if (PRO_ACTIVATION_HASHES.includes(inputHash)) {
      // Generate a signed token
      const secureToken = generateSecureToken();
      localStorage.setItem(STORAGE_KEY_PRO, secureToken);
      setIsPro(true);
      return true;
    }
    return false;
  };

  return { isPro, loading, activatePro };
};