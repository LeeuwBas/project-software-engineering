import { useState, useEffect } from 'react';
import { getActiveModules, setActiveModules } from '@/lib/settings';
import { EnabledModules } from '@/lib/storage';

const DEFAULT_MODULES: EnabledModules = {
    water: true,
    sleep: true,
    steps: true,
    stress: true,
    food: true,
};

export function useModuleManagement() {
    const [activeModules, setActiveModulesState] = useState<EnabledModules>(DEFAULT_MODULES);

    useEffect(() => {
        setActiveModulesState(getActiveModules());
    }, []);

    function toggleModule(moduleId: keyof EnabledModules) {
        setActiveModulesState((current) => ({
            ...current,
            [moduleId]: !current[moduleId],
        }));
    }

    function isSelected(moduleId: keyof EnabledModules) {
        return activeModules[moduleId] ?? false;
    }

    function saveModules() {
        setActiveModules(activeModules);
    }

    return { activeModules, toggleModule, isSelected, saveModules };
}
