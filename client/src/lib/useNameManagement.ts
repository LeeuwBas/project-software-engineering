import { useState } from 'react';
import { savePetName, saveUserName } from '@/lib/settings';

export function useNameManagement(initialPetName = '', initialUserName = '') {
  const [petName, setPetName] = useState(initialPetName);
  const [userName, setUserName] = useState(initialUserName);
  const [errors, setErrors] = useState<Record<string, string[] | null>>({});

  function validateName(name: string) {
    const regex = /^[A-Za-z]+$/;
    return regex.test(name);
  }

  function validateAndSave() {
    let isValid = true;
    const newErrors: Record<string, string[] | null> = { pet: null, user: null };

    if (!validateName(petName)) {
      newErrors.pet = ['Only include (capitalized) letters.'];
      isValid = false;
    }

    if (!validateName(userName)) {
      newErrors.user = ['Only include (capitalized) letters.'];
      isValid = false;
    }

    setErrors(newErrors);

    if (isValid) {
      savePetName(petName);
      saveUserName(userName);
    }

    return isValid;
  }

  return { petName, setPetName, userName, setUserName, errors, validateAndSave };
}