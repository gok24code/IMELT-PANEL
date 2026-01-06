import { MD2DarkTheme } from 'react-native-paper';

// Define our custom blue-toned dark theme based on the MD2 engine
export const theme = {
  ...MD2DarkTheme, // Start with the default MD2 dark theme
  colors: {
    ...MD2DarkTheme.colors, // Inherit default MD2 dark colors
    primary: '#58a6ff', // A pleasant blue for primary actions (buttons, etc.)
    accent: '#3f84e3', // A secondary blue
    background: '#0d1117', // A very dark, almost black background
    surface: '#161b22', // For card backgrounds, app bars, etc.
    text: '#c9d1d9', // Light grey for text
    placeholder: '#8b949e',
    // MD2 uses 'backdrop' and 'notification' differently, so we ensure they are set
    backdrop: 'rgba(1, 4, 9, 0.8)',
    notification: '#ff80ab', // A sample notification color
  },
};
