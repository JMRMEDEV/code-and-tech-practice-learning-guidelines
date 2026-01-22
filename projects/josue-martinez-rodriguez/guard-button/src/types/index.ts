export type PermissionStatus = 'granted' | 'denied' | 'undetermined';

export interface RecordingState {
  isRecording: boolean;
  recordingUri: string | null;
  error: string | null;
}
