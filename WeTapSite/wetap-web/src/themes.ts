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
    id: 'dark',
    name: 'Dark',
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
    id: 'light',
    name: 'Light',
    colors: {
      bg: '255 255 255',
      black: '104 104 104',
      'zinc-50': '104 104 104',
      'zinc-100': '33 33 37',
      'zinc-200': '220 217 201',
      'zinc-300': '104 104 104',
      'zinc-400': '33 33 37', // це текст
      'zinc-500': '104 104 104',
      'zinc-600': '104 104 104',
      'zinc-700': '104 104 104',
      'zinc-800': '104 104 104',
      'zinc-900': '104 104 104',
      'zinc-950': '255 255 255',
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
