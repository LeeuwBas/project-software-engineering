import { AppText } from '@/components/AppText';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Text } from '@/components/ui/text';
import ChartIcon from '@assets/icons/chart.svg';
import PersonIcon from '@assets/icons/person.svg';
import { ScrollView, View } from 'react-native';
import { useColorScheme } from 'nativewind';

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View className="w-full gap-3">
      <AppText className="text-xl font-bold">{title}</AppText>
      {children}
    </View>
  );
}

function ColorSwatch({ label, className }: { label: string; className: string }) {
  return (
    <View className="w-1/2 flex-row items-center gap-3 py-2">
      <View className={`size-12 border border-border ${className}`} />
      <AppText className="text-sm">{label}</AppText>
    </View>
  );
}

function ColorGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View className="w-full gap-1">
      <AppText className="mb-1 font-bold">{title}</AppText>
      <View className="flex-row flex-wrap">{children}</View>
    </View>
  );
}

export default function ReferencePage() {
  const { colorScheme, toggleColorScheme } = useColorScheme();

  return (
    <ScrollView contentContainerClassName="items-start gap-8 p-8 bg-background">
      <Button onPress={toggleColorScheme}>
        {colorScheme === 'dark' ? 'sun icon' : 'dark icon'}
      </Button>
      <Section title="Colors">
        <AppText className="text-sm text-muted-foreground">
          Key color philosophy: Use primary, secondary and accent colors for drawing attention to
          key elements, such as parts that are very important to the core of the functinality.
        </AppText>
        <ColorGroup title="Primary">
          <ColorSwatch label="Background" className="bg-background" />
          <ColorSwatch label="Foreground" className="bg-foreground" />
          <ColorSwatch label="Primary" className="bg-primary" />
          <ColorSwatch label="Primary Foreground" className="bg-primary-foreground" />
        </ColorGroup>
        <ColorGroup title="Secondary & Accent">
          <ColorSwatch label="Secondary" className="bg-secondary" />
          <ColorSwatch label="Secondary Foreground" className="bg-secondary-foreground" />
          <ColorSwatch label="Accent" className="bg-accent" />
          <ColorSwatch label="Accent Foreground" className="bg-accent-foreground" />
        </ColorGroup>
        <ColorGroup title="UI Components">
          <ColorSwatch label="Card" className="bg-card" />
          <ColorSwatch label="Card Foreground" className="bg-card-foreground" />
          <ColorSwatch label="Popover" className="bg-popover" />
          <ColorSwatch label="Popover Foreground" className="bg-popover-foreground" />
          <ColorSwatch label="Muted" className="bg-muted" />
          <ColorSwatch label="Muted Foreground" className="bg-muted-foreground" />
        </ColorGroup>
        <ColorGroup title="Utility & Form">
          <ColorSwatch label="Border" className="bg-border" />
          <ColorSwatch label="Border Dark" className="bg-border-dark" />
        </ColorGroup>
        <AppText className="text-sm text-muted-foreground">
          Use <Text className="font-bold">border</Text> for subtle borders (cards, inputs). Use{' '}
          <Text className="font-bold">border-dark</Text> for higher-contrast borders where
          distinction matters (stat bars, progress indicators).
        </AppText>
        <ColorGroup title="Utility & Form">
          <ColorSwatch label="Input" className="bg-input" />
          <ColorSwatch label="Ring" className="bg-ring" />
          <ColorSwatch label="Destructive" className="bg-destructive" />
        </ColorGroup>
      </Section>

      <Section title="Buttons">
        <View className="flex-row flex-wrap gap-3">
          <Button>
            <ChartIcon width={20} height={20} color="white" />
            <Text>Default</Text>
          </Button>
          <Button variant="secondary">
            <PersonIcon width={20} height={20} color="white" />
            <Text>Secondary</Text>
          </Button>
          <Button variant="outline">
            <ChartIcon width={20} height={20} />
            <Text>Outline</Text>
          </Button>
          <Button variant="ghost">
            <Text>Ghost</Text>
          </Button>
          <Button variant="destructive">
            <Text>Destructive</Text>
          </Button>
          <Button variant="link">
            <Text>Link</Text>
          </Button>
          <Button disabled>
            <Text>Disabled</Text>
          </Button>
        </View>
        <AppText className="text-sm text-muted-foreground">
          Use the base color (e.g. primary) for the inside. Use{' '}
          <Text className="font-bold">color-dark</Text> (e.g. primary-dark) for button borders.
        </AppText>
      </Section>

      <Section title="Badges">
        <View className="flex-row flex-wrap gap-2">
          <Badge>
            <Text>Default</Text>
          </Badge>
          <Badge variant="secondary">
            <Text>Secondary</Text>
          </Badge>
          <Badge variant="destructive">
            <Text>Destructive</Text>
          </Badge>
          <Badge variant="outline">
            <Text>Outline</Text>
          </Badge>
        </View>
      </Section>

      <Section title="Card">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Card Title</CardTitle>
            <CardDescription>A short description of this card.</CardDescription>
          </CardHeader>
          <CardContent>
            <AppText>Card body content goes here.</AppText>
          </CardContent>
          <CardFooter className="gap-2">
            <Button>
              <Text>Confirm</Text>
            </Button>
            <Button variant="outline">
              <Text>Cancel</Text>
            </Button>
          </CardFooter>
        </Card>
      </Section>

      <Section title="Form">
        <View className="w-full gap-4">
          <View className="gap-1.5">
            <Label nativeID="name-label">
              <Text>Name</Text>
            </Label>
            <Input placeholder="Enter your name" aria-labelledby="name-label" />
          </View>
          <View className="gap-1.5">
            <Label nativeID="email-label">
              <Text>Email</Text>
            </Label>
            <Input
              placeholder="Enter your email"
              keyboardType="email-address"
              aria-labelledby="email-label"
            />
          </View>
          <Button>
            <Text>Submit</Text>
          </Button>
        </View>
      </Section>
    </ScrollView>
  );
}
