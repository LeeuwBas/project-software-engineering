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

/**
 * Owner of helper functions to enable/disable module tracking.
 *
 * @return Helper functions
 */
export function useModuleManagement() {
    const [activeModules, setActiveModulesState] = useState<EnabledModules>(DEFAULT_MODULES);

    useEffect(() => {
        setActiveModulesState(getActiveModules());
    }, []);

    /**
     * Enables or disables a module
     * @param moduleId Module to disable/enable
     */
    function toggleModule(moduleId: keyof EnabledModules) {
        setActiveModulesState((current) => ({
            ...current,
            [moduleId]: !current[moduleId],
        }));
    }

    /**
     * @param moduleId Module to check activity for
     * @returns boolean whether the module is selected or not
     */
    function isSelected(moduleId: keyof EnabledModules) {
        return activeModules[moduleId] ?? false;
    }

    /**
     * Saves the current list active modules to storage
     */
    function saveModules() {
        setActiveModules(activeModules);
    }

    return { activeModules, toggleModule, isSelected, saveModules };
}
