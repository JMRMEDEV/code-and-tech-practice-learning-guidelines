import { useState, useRef, useEffect } from 'react';
import { Audio } from 'expo-av';
import type { RecordingState } from '@/types';
import { RECORDING_DURATION } from '@/utils/constants';

export const useAudioRecording = () => {
  const [state, setState] = useState<RecordingState>({
    isRecording: false,
    recordingUri: null,
    error: null,
  });

  const recordingRef = useRef<Audio.Recording | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      if (recordingRef.current) {
        recordingRef.current.stopAndUnloadAsync();
      }
    };
  }, []);

  const startRecording = async () => {
    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
        staysActiveInBackground: true,
      });

      const recording = new Audio.Recording();
      await recording.prepareToRecordAsync({
        android: {
          extension: '.wav',
          outputFormat: Audio.AndroidOutputFormat.DEFAULT,
          audioEncoder: Audio.AndroidAudioEncoder.DEFAULT,
        },
        ios: {
          extension: '.wav',
          outputFormat: Audio.IOSOutputFormat.LINEARPCM,
          audioQuality: Audio.IOSAudioQuality.HIGH,
          sampleRate: 44100,
          numberOfChannels: 2,
          bitRate: 128000,
          linearPCMBitDepth: 16,
          linearPCMIsBigEndian: false,
          linearPCMIsFloat: false,
        },
        web: {
          mimeType: 'audio/wav',
          bitsPerSecond: 128000,
        },
      });

      await recording.startAsync();
      recordingRef.current = recording;

      setState({
        isRecording: true,
        recordingUri: null,
        error: null,
      });

      timerRef.current = setTimeout(() => {
        stopRecording();
      }, RECORDING_DURATION);
    } catch (error) {
      console.error('Failed to start recording:', error);
      setState({
        isRecording: false,
        recordingUri: null,
        error: 'Failed to start recording. Please check microphone permissions.',
      });
    }
  };

  const stopRecording = async () => {
    try {
      if (!recordingRef.current) return;

      await recordingRef.current.stopAndUnloadAsync();
      const uri = recordingRef.current.getURI();
      
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        playsInSilentModeIOS: false,
        staysActiveInBackground: false,
      });

      recordingRef.current = null;

      setState({
        isRecording: false,
        recordingUri: uri,
        error: null,
      });
    } catch (error) {
      console.error('Failed to stop recording:', error);
      setState({
        isRecording: false,
        recordingUri: null,
        error: 'Failed to stop recording.',
      });
    }
  };

  return {
    isRecording: state.isRecording,
    recordingUri: state.recordingUri,
    error: state.error,
    startRecording,
    stopRecording,
  };
};
