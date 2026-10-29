import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.coosiks.mslift',
  appName: 'MSLift',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
    cleartext: true
  },
  plugins: {
    LocalNotifications: {
      smallIcon: 'ic_launcher',
      iconColor: '#6366f1'
    }
  }
};

export default config;
