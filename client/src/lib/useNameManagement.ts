import { useState } from 'react';
import { savePetName, saveUserName } from '@/lib/settings';

/**
 * Owner of helper functions to validate format of, and set new pet and username.
 *
 * @return Helper functions
 */
export function useNameManagement(initialPetName = '', initialUserName = '') {
    const [petName, setPetName] = useState(initialPetName);
    const [userName, setUserName] = useState(initialUserName);
    const [errors, setErrors] = useState<Record<string, string[] | null>>({});

    /**
     * Validates name using regex
     * @param name string to be validated

     * @returns boolean whether the name is valid or not
     */
    function validateName(name: string) {
        const regex = /^[A-Za-z]+$/; // Accepts only letters or capitals
        return regex.test(name);
    }

    /**
     * Validates the input username and petname and saves them to the storage if so.
     * If not successful, records errors to be used for display.
     * @returns boolean whether this function saved names successfully
     */
    function validateAndSave() {
        let isValid = true;
        const newErrors: Record<string, string[] | null> = { pet: null, user: null };

        if (!validateName(petName)) {
            newErrors.pet = ['Only include letters.'];
            isValid = false;
        }

        if (!validateName(userName)) {
            newErrors.user = ['Only include letters.'];
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
