import { getGrantedPermissions } from 'react-native-health-connect';
import { useState, useEffect } from 'react';

export function useHealthPermission(recordType = 'Steps', accessType = 'read') {
  const [granted, setGranted] = useState<boolean | null>(null);

  useEffect(() => {
    const check = async () => {
      try {
        const permissions = await getGrantedPermissions();
        const hasPermission = permissions.some(
          (p) => p.recordType === recordType && p.accessType === accessType
        );
        setGranted(hasPermission);
      } catch {
        setGranted(false);
      }
    };
    check();
  }, [recordType, accessType]);

  return granted;
}