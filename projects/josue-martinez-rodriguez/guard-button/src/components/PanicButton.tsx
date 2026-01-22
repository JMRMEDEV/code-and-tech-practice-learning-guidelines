import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity } from 'react-native';
import { LongPressGestureHandler, State, HandlerStateChangeEvent, LongPressGestureHandlerEventPayload } from 'react-native-gesture-handler';
import * as Haptics from 'expo-haptics';
import * as Sharing from 'expo-sharing';
import { COLORS, PRESS_DURATION } from '@/utils/constants';
import { useAudioRecording } from '@/hooks/useAudioRecording';

interface PanicButtonProps {
  disabled: boolean;
}

export const PanicButton: React.FC<PanicButtonProps> = ({ disabled }) => {
  const { isRecording, recordingUri, error, startRecording } = useAudioRecording();
  const [pulseAnim] = useState(new Animated.Value(1));
  const animationLoopRef = useRef<Animated.CompositeAnimation | null>(null);

  useEffect(() => {
    if (!isRecording) {
      animationLoopRef.current?.stop();
      pulseAnim.stopAnimation();
      pulseAnim.setValue(1);
    }
  }, [isRecording]);

  const handleLongPress = async ({ nativeEvent }: HandlerStateChangeEvent<LongPressGestureHandlerEventPayload>) => {
    if (nativeEvent.state === State.ACTIVE && !disabled && !isRecording) {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      startRecording();

      animationLoopRef.current = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.1,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
        ])
      );
      animationLoopRef.current.start();
    }
  };

  const handleShare = async () => {
    if (recordingUri) {
      try {
        await Sharing.shareAsync(recordingUri);
      } catch (error) {
        console.error('Failed to share:', error);
      }
    }
  };

  const buttonColor = isRecording ? COLORS.ORANGE : COLORS.RED;

  return (
    <View style={styles.container}>
      <LongPressGestureHandler
        onHandlerStateChange={handleLongPress}
        minDurationMs={PRESS_DURATION}
        enabled={!disabled && !isRecording}
      >
        <Animated.View
          style={[
            styles.button,
            { backgroundColor: buttonColor, transform: [{ scale: pulseAnim }] },
            disabled && styles.buttonDisabled,
          ]}
        >
          <Text style={styles.text}>PANIC</Text>
        </Animated.View>
      </LongPressGestureHandler>

      {isRecording && (
        <Text style={styles.statusText}>Recording...</Text>
      )}

      {recordingUri && (
        <View style={styles.confirmationContainer}>
          <Text style={styles.confirmationText}>✓ Recording saved</Text>
          <Text style={styles.pathText}>{recordingUri}</Text>
          <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
            <Text style={styles.shareButtonText}>Open/Share File</Text>
          </TouchableOpacity>
        </View>
      )}

      {error && (
        <Text style={styles.errorText}>{error}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000000',
  },
  button: {
    width: 200,
    height: 200,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  text: {
    color: COLORS.WHITE,
    fontSize: 32,
    fontWeight: 'bold',
  },
  statusText: {
    color: COLORS.ORANGE,
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
  },
  confirmationContainer: {
    marginTop: 20,
    padding: 15,
    alignItems: 'center',
  },
  confirmationText: {
    color: '#22C55E',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  pathText: {
    color: '#AAAAAA',
    fontSize: 12,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  errorText: {
    color: '#EF4444',
    fontSize: 14,
    marginTop: 20,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  shareButton: {
    marginTop: 15,
    backgroundColor: COLORS.RED,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  shareButtonText: {
    color: COLORS.WHITE,
    fontSize: 16,
    fontWeight: 'bold',
  },
});
