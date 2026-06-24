import { AppText } from '@/components/AppText';
import { CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { View } from 'react-native';

type ChangeNameProps = {
  petName: string;
  setPetName: (name: string) => void;
  userName: string;
  setUserName: (name: string) => void;
  errors?: Record<string, string[] | null>;
};

/** UI element with fields to change names of both user and pet.
 * @param petName Current string value of pet's name.
 * @param setPetName Callback function to update pet's name.
 * @param userName Current string value of username.
 * @param setUserName Callback function to update username.
 * @param errors Optional object containing error arrays for the fields for pet and username.
 *
 * @returns JSX element
 */
export function ChangeName({
  petName,
  setPetName,
  userName,
  setUserName,
  errors = {},
}: ChangeNameProps) {
  const maxPetNameLength = 12;
  const maxUserNameLength = 16;

  return (
    <CardContent className="gap-5">
      <View className="gap-1.5">
        <AppText className="font-bold">What is your companion's name?</AppText>

        <Input
          placeholder="Companion name"
          autoCapitalize="words"
          returnKeyType="next"
          value={petName}
          onChangeText={setPetName}
          maxLength={maxPetNameLength}
        />

        <View className="flex-row items-center justify-between">
          <View className="flex-1 pr-2">
            {errors.pet && (
              <AppText numberOfLines={1} className="text-sm text-red-500 opacity-80">
                {errors.pet[0]}
              </AppText>
            )}
          </View>

          <AppText className="text-right">
            {petName.length}/{maxPetNameLength}
          </AppText>
        </View>
      </View>

      <View className="gap-1.5">
        <AppText className="font-bold">What is your name?</AppText>

        <Input
          placeholder="Your name"
          autoCapitalize="words"
          returnKeyType="done"
          value={userName}
          onChangeText={setUserName}
          maxLength={maxUserNameLength}
        />

        <View className="flex-row items-center justify-between">
          <View className="flex-1 pr-2">
            {errors.user && (
              <AppText numberOfLines={1} className="text-sm text-red-500 opacity-80">
                {errors.user[0]}
              </AppText>
            )}
          </View>

          <AppText className="text-right">
            {userName.length}/{maxUserNameLength}
          </AppText>
        </View>
      </View>
    </CardContent>
  );
}
