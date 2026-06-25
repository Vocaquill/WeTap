export interface Theme {
  id: string;
  name: string;
  colors: {
    bg: string;
    black: string;
    'zinc-50': string;
    'zinc-100': string;
    'zinc-200': string;
    'zinc-300': string;
    'zinc-400': string;
    'zinc-500': string;
    'zinc-600': string;
    'zinc-700': string;
    'zinc-800': string;
    'zinc-900': string;
    'zinc-950': string;
  };
}

export const themes: Theme[] = [
  {
    id: 'standard',
    name: 'Standard',
    colors: {
      bg: '18 18 19',
      black: '0 0 0',
      'zinc-50': '250 250 250',
      'zinc-100': '244 244 245',
      'zinc-200': '228 228 231',
      'zinc-300': '212 212 216',
      'zinc-400': '161 161 170',
      'zinc-500': '113 113 122',
      'zinc-600': '82 82 91',
      'zinc-700': '63 63 70',
      'zinc-800': '39 39 42',
      'zinc-900': '24 24 27',
      'zinc-950': '9 9 11',
    }
  },
  {
    id: 'summer',
    name: 'Summer Pastel',
    colors: {
      bg: '23 26 33',
      black: '14 16 20',
      'zinc-50': '247 246 240',
      'zinc-100': '235 233 223',
      'zinc-200': '220 217 201',
      'zinc-300': '194 190 170',
      'zinc-400': '166 192 179',
      'zinc-500': '140 166 153',
      'zinc-600': '112 138 125',
      'zinc-700': '56 77 67',
      'zinc-800': '42 49 59',
      'zinc-900': '31 37 46',
      'zinc-950': '20 24 31',
    }
  }
];

export function applyTheme(themeId: string) {
  const theme = themes.find(t => t.id === themeId) || themes[0];
  const root = document.documentElement;
  Object.entries(theme.colors).forEach(([key, value]) => {
    root.style.setProperty(`--color-${key}`, value);
  });
  localStorage.setItem('theme', themeId);
}

export function getActiveTheme(): string {
  return localStorage.getItem('theme') || 'standard';
}
