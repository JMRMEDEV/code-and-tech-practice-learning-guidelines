import { StatusBar } from 'expo-status-bar';
import { View, Text, StyleSheet, AppState } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useEffect, useRef } from 'react';
import { PanicButton } from '@/components/PanicButton';
import { usePermissions } from '@/hooks/usePermissions';

export default function App() {
  const { hasPermission, permissionStatus } = usePermissions();
  const appState = useRef(AppState.currentState);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
        console.log('App has come to the foreground');
      } else if (nextAppState.match(/inactive|background/)) {
        console.log('App has gone to the background');
      }
      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, []);

  if (permissionStatus === 'undetermined') {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Requesting microphone permission...</Text>
        <StatusBar style="light" />
      </View>
    );
  }

  if (!hasPermission) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Microphone permission denied</Text>
        <Text style={styles.subtext}>
          Please enable microphone access in your device settings to use this app.
        </Text>
        <StatusBar style="light" />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <PanicButton disabled={false} />
      <StatusBar style="light" />
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  text: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtext: {
    color: '#AAAAAA',
    fontSize: 14,
    textAlign: 'center',
  },
});
