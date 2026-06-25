import { NotchedBox } from '@/components/ui/notched-box';
import StressMenu from '@/components/widgets//StressMenu';
import Menu from '@/components/widgets/Menu';
import Settings from '@/components/widgets/Settings';
import Stats from '@/components/widgets/Stats';
import { useAppContext } from '@/lib/AppContext';
import { foodBridge, sleepBridge, stepsBridge, waterBridge } from '@/lib/api/APIBridge';
import { cancelWaterNotification, setWaterNotifaction } from '@/lib/notificationSetter';
import { GoaledModule, MODULES } from '@/lib/types';
import CheckIcon from '@assets/icons/toolbar_icons/check.svg';
import PlusIcon from '@assets/icons/toolbar_icons/plus.svg';
import ProfileIcon from '@assets/icons/toolbar_icons/profile.svg';
import StatsIcon from '@assets/icons/toolbar_icons/stats.svg';
import { useColorScheme } from 'nativewind';
import { useEffect, useState } from 'react';
import { Pressable, View } from 'react-native';
import {
  renderMenuStep,
  renderSettingsStep,
  renderStatsStep,
} from '@/components/tutorial/tutorial-steps';
import { TourZone, useTour } from 'react-native-lumen';
/**
 * The toolbar on the bottom of the homepage containing buttons for each main popup
 */
export default function Toolbar() {
  const { colorScheme } = useColorScheme();
  const iconColor = colorScheme === 'dark' ? '#f2f2f2' : '#555555';

  // While a tutorial step is active, drop the toolbar's elevated stacking
  // (z-20) so the tour overlay can darken the toolbaar.
  const { currentStep } = useTour();
  const tourActive = currentStep !== null;

  const moduleValues: Record<string, number> = Object.fromEntries(
    MODULES.map((module) => [module.id, module.useValue() ?? 0])
  );

  const goaledModules: GoaledModule[] = MODULES.filter(
    (module): module is GoaledModule => 'goalConfig' in module
  );

  const goals: Record<string, number> = Object.fromEntries(
    goaledModules.map((module) => [module.id, module.bridge.useGoal() ?? 0])
  );

  // App context variables containing state of popups
  const {
    statsOpen,
    menuOpen,
    settingsOpen,
    changeMenu,
    changeSettings,
    changeStats,
    stressMenuOpen,
    changeStressMenu,
    sendStress,
  } = useAppContext();

  // All draft values to be used in the menu popup
  const [draftWater, setDraftWater] = useState(moduleValues.water);
  const [draftFood, setDraftFood] = useState(moduleValues.food);
  const [draftSleep, setDraftSleep] = useState(moduleValues.sleep);
  const [draftGoals, setDraftGoals] = useState<Record<string, number>>(goals);

  // What to do when the menu button is pressed
  async function menuButton() {
    if (menuOpen || stressMenuOpen) {
      // Save values
      await waterBridge.set(draftWater);
      await foodBridge.set(draftFood);
      await sleepBridge.set(draftSleep);

      // Save goals
      await foodBridge.setGoal(draftGoals['food']);
      await stepsBridge.setGoal(draftGoals['steps']);
      await waterBridge.setGoal(draftGoals['water']);

      // Set notification if water goal is not reached
      if (draftWater >= draftGoals['water']) {
        cancelWaterNotification();
      } else {
        setWaterNotifaction();
      }

      // Close menu
      if (menuOpen) changeMenu();
      if (stressMenuOpen) changeStressMenu();
    } else {
      changeMenu();
    }
  }

  // Refresh value in popup when retrieved from storage
  useEffect(() => {
    if (menuOpen) {
      setDraftWater(moduleValues.water);
      setDraftFood(moduleValues.food);
      setDraftSleep(moduleValues.sleep);
      setDraftGoals(goals);
    }
  }, [menuOpen]);

  return (
    <View
      className={`relative left-0 right-0 mt-auto w-full items-center ${tourActive ? '' : 'z-20'}`}>
      {/* Popups */}
      <Stats />
      <StressMenu />
      <Menu
        water={draftWater}
        setWater={setDraftWater}
        steps={moduleValues.steps} // Steps doesn't need a draft because it is not changed in the menu.
        onStressPress={() => {
          changeStressMenu();
          changeMenu();
        }}
        food={draftFood}
        setFood={setDraftFood}
        sleep={draftSleep}
        setSleep={setDraftSleep}
        goals={draftGoals}
        setGoals={setDraftGoals}
      />
      <Settings />

      {/* The toolbar */}
      <View className="flex w-full flex-row justify-center gap-44 border-t-4 border-border bg-card p-1">
        {/* Stats button */}
        <TourZone
          stepKey="stats-button"
          description="This is where you can see your stats."
          renderCustomCard={renderStatsStep}>
          <Pressable
            disabled={menuOpen || settingsOpen || stressMenuOpen}
            className={`p-2 transition-opacity duration-200 ${menuOpen || settingsOpen || stressMenuOpen ? 'opacity-0' : 'opacity-100'}`}
            onPress={() => changeStats()}>
            <StatsIcon width={28} height={28} color={iconColor} />
          </Pressable>
        </TourZone>

        {/* Menu button */}
        <TourZone
          stepKey="menu-button"
          description="This is where you log all your habits."
          renderCustomCard={renderMenuStep}
          style={{ position: 'absolute', top: -25 }}>
          <NotchedBox
            className={`transition-opacity duration-200 ${tourActive ? '' : 'shadow-block'} ${
              statsOpen || settingsOpen ? 'opacity-0' : 'opacity-100'
            }`}
            fillClassName="bg-primary"
            borderClassName="bg-primary-dark">
            <Pressable
              disabled={statsOpen || settingsOpen}
              className={`size-16 items-center justify-center`}
              onPress={async () => {
                if (stressMenuOpen) {
                  await sendStress();
                }
                menuButton();
              }}>
              {(menuOpen || stressMenuOpen) && <CheckIcon width={50} height={50} color={'white'} />}

              {!menuOpen && !stressMenuOpen && <PlusIcon width={50} height={50} color={'white'} />}
            </Pressable>
          </NotchedBox>
        </TourZone>

        {/* Settings button */}
        <TourZone
          stepKey="settings-button"
          description="And here you'll find all of your settings."
          renderCustomCard={renderSettingsStep}>
          <Pressable
            disabled={statsOpen || menuOpen || stressMenuOpen}
            className={`p-2 transition-opacity  duration-200 ${statsOpen || menuOpen || stressMenuOpen ? 'opacity-0' : 'opacity-100'}`}
            onPress={() => changeSettings()}>
            <ProfileIcon width={28} height={28} color={iconColor} />
          </Pressable>
        </TourZone>
      </View>
    </View>
  );
}
