export default function getMood(happiness: number) {
    if (happiness < 20) return 'Sad';
    if (happiness < 40) return 'Gloomy';
    if (happiness < 60) return 'Neutral';
    if (happiness < 80) return 'Content';
    return 'Happy';
}
