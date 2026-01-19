# React Native/Expo Code Challenge: The "Guard-Button"

## The Company Message

> "At **Resilience Mobile Solutions**, our mission is to empower users with immediate, reliable safety tools. This challenge is designed to test your ability to integrate crucial mobile features—like **audio recording** and **background execution**—into a simple, life-saving application."

---

## Tech Stack

* **Framework:** React Native (Functional Components & Hooks)
* **Platform:** Expo (Managed Workflow)
* **Audio/Media:** `expo-av`
* **Permissions:** `expo-permissions` or the corresponding modules for handling microphone and background tasks.

---

## Learning Goals

This challenge focuses on mastering the following concepts:

1.  **State Management:** Effectively handling the app state (e.g., `isRecording`, `isPanicMode`).
2.  **Permissions Handling:** Requesting and managing sensitive user permissions (e.g., Microphone access).
3.  **Asynchronous Operations:** Working with `expo-av` for starting, stopping, and saving audio recordings.
4.  **UI/UX for Emergency Apps:** Designing a clear, single-purpose interface for high-stress situations.

---

## Expected Capabilities

A successful solution will demonstrate proficiency in:

* Creating a responsive and intuitive React Native UI.
* Implementing **error handling** for file system and audio operations.
* Using React hooks (`useState`, `useEffect`, `useCallback`) correctly.
* Understanding and applying asynchronous code patterns (async/await, Promises).
* **Crucially:** Understanding how to handle background tasks, although a full, persistent background implementation is considered **bonus**.

---

## Functional Requirements

| Requirement | Description | Implementation Details |
| :--- | :--- | :--- |
| **1. Panic Button UI** | The main screen must feature a prominent, centrally located "Panic" button. | The button should be large, clear, and easy to press in an emergency. |
| **2. Audio Recording Start** | When the user **presses and holds** the Panic button for a minimum of **2 seconds**, audio recording must start immediately. | Use a gesture handler (like `react-native-gesture-handler`) or a timeout mechanism to detect the "press and hold." |
| **3. Visual/Haptic Feedback** | Provide clear feedback when recording begins. | The button must change color (e.g., from **Red** to **Flashing Orange**) and trigger a **haptic vibration**. |
| **4. Recording Duration** | The audio recording must run for a fixed duration of **30 seconds** and then automatically stop. | Use `setTimeout` or similar logic to manage the recording length. |
| **5. Saving the Audio** | Once the recording is complete, the audio file (e.g., `.m4a` or `.wav`) must be saved locally on the device. | The app should display a confirmation message with the local file path (e.g., "Recording saved to: `/path/to/recording.m4a`"). |
| **6. User Permissions** | The app must properly request and handle **Microphone permissions** on startup. | If permissions are denied, the button should be disabled, and a clear message should instruct the user to enable them in settings. |
| **7. Background Operation (Basic)** | The audio recording must **continue running** even if the user minimizes or switches away from the app during the 30-second recording period. | *Hint:* This usually involves basic awareness of the App State (e.g., using the `AppState` API in React Native). |

---

## Evaluation Focus

Your solution will be assessed based on the following criteria, ranked by importance:

| Priority | Focus Area | Description |
| :--- | :--- | :--- |
| **High** | **Reliability & Stability** | The core requirement: The audio recording must start and stop successfully, and the file must be saved without crashing the application. All promises must be handled gracefully. |
| **Medium** | **Permissions & Error Handling** | Correctly requesting and gracefully handling cases where Microphone permissions are denied. Clear feedback must be provided for all errors. |
| **Medium** | **UX/State Feedback** | Clear visual (color change) and haptic feedback when the recording state changes (starting, recording, saved). Button should be disabled during the 30s recording. |
| **Low** | **Code Quality** | Adherence to modern React best practices (clean hooks usage, component separation, readable variable names) and minimal unnecessary re-renders. |

---

## Constraints

These limitations and rules must be followed during development:

1.  **Dependencies:** You may only use modules available in the standard Expo SDK (e.g., `expo-av`, `expo-permissions`, `react-native-gesture-handler`). **External third-party libraries not included in the Expo SDK are forbidden.**
2.  **State Management:** State must be managed using built-in React Hooks (`useState`, `useReducer`, `useContext`). Dedicated state management libraries (e.g., Redux, Zustand) are **not allowed**.
3.  **UI:** Use standard React Native components (`View`, `Text`, `Pressable`, etc.). Styling can be simple, focusing on functionality over complex aesthetics.
4.  **Device:** The solution must be tested and proven to work on a physical iOS or Android device using the Expo Go app.

---

## Extended 5-Day Plan

This plan breaks down the challenge into smaller, more manageable daily tasks, providing ample time for testing and refinement.

| Day | Focus Area | Tasks | Goal |
| :--- | :--- | :--- | :--- |
| **Day 1** | **Setup & Initial UI** | 1. Initialize Expo project and install necessary dependencies (`expo-av`). 2. Create the main `PanicButton` component structure. 3. Design and implement the primary visual style for the prominent, red "Panic" button. | **Goal:** A well-styled, static button component that adheres to the UX/UI requirement. |
| **Day 2** | **Permissions & Audio State** | 1. Implement the logic to request **Microphone permissions** upon application load. 2. Implement the UI state feedback for permissions: Disable the button if permissions are denied; show an informational message. 3. Set up the `Audio.Recording` object and related state variables (`isRecording`, `recordingUri`, etc.). | **Goal:** The app correctly handles and displays the current state of microphone permissions. |
| **Day 3** | **Start Recording Logic & Gesture** | 1. Implement the **press-and-hold** detection logic (2 seconds) using a gesture handler or timer function. 2. Write the robust `startRecording` function, including error handling for the `expo-av` setup. 3. Integrate visual feedback (e.g., color change to Orange) and haptic feedback when the recording successfully starts. | **Goal:** Holding the button starts the audio recording reliably, and the UI provides correct, immediate feedback. |
| **Day 4** | **Stopping, Saving & Duration** | 1. Implement the 30-second `setTimeout` to trigger automatic stopping. 2. Write the `stopRecording` function, which must call `recording.stopAndUnloadAsync()`. 3. Implement the logic to retrieve the file URI (`recording.getURI()`) and save the path to state. 4. Display a confirmation message with the saved file path. | **Goal:** A complete 30-second recording cycle that saves the file and confirms its location. |
| **Day 5** | **Polish, Background & Error Handling** | 1. Test the **basic background operation** (minimizing the app) to ensure the recording continues running for the full 30 seconds. 2. Thoroughly test and refine all **error handling** paths (e.g., what if recording fails to start?). 3. Code cleanup, adding comments, and ensuring adherence to all Constraints and Functional Requirements. | **Goal:** A stable, polished, and fully functional application ready for review. |

---

## Bonus Challenge: **"Persistent Sentinel"**

* **Persist Recordings:** Implement functionality to show a list of all locally saved panic recordings with an option to play them back using `expo-av`.
* **True Background Task:** Implement a proper **background task** (using `expo-task-manager` or a similar solution) that, if triggered, would initiate a **location track** and/or a minimal "still recording" notification, even after the app has been fully closed.