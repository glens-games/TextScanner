import { CameraView, useCameraPermissions } from 'expo-camera';
import { useRouter } from 'expo-router';
import { useRef, useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Spacing } from '@/constants/theme';

export default function CameraScreen() {
  const router = useRouter();
  const [permission, requestPermission] = useCameraPermissions();
  const [isCameraReady, setIsCameraReady] = useState(false);
  const cameraRef = useRef<CameraView>(null);

  if (!permission) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.message}>Requesting camera permission...</Text>
      </SafeAreaView>
    );
  }

  if (!permission.granted) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.permissionContainer}>
          <Text style={styles.cameraIcon}>📷</Text>
          <Text style={styles.message}>Camera permission is required</Text>
          <TouchableOpacity 
            style={styles.permissionButton}
            onPress={requestPermission}>
            <Text style={styles.permissionButtonText}>Grant Permission</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const handleCapture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync({
          quality: 1,
          skipProcessing: false,
        });
        
        if (photo) {
          // In a real app, you would save this and navigate to a preview/edit screen
          Alert.alert(
            'Photo Captured',
            `Photo saved to: ${photo.uri}`,
            [
              {
                text: 'OK',
                onPress: () => router.back(),
              },
            ]
          );
        }
      } catch (error) {
        console.error('Failed to take picture:', error);
        Alert.alert('Error', 'Failed to capture photo');
      }
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.closeButton} 
          onPress={() => router.back()}>
          <Text style={styles.closeIcon}>✕</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Take Photo</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.cameraContainer}>
        <CameraView
          ref={cameraRef}
          style={styles.camera}
          facing="back"
          onCameraReady={() => setIsCameraReady(true)}
        />
      </View>

      <View style={styles.controlsContainer}>
        <View style={styles.controlsPlaceholder} />
        <TouchableOpacity
          style={[styles.captureButton, !isCameraReady && styles.captureButtonDisabled]}
          onPress={handleCapture}
          disabled={!isCameraReady}>
          <View style={styles.captureButtonInner} />
        </TouchableOpacity>
        <View style={styles.controlsPlaceholder} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.one,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  closeButton: {
    padding: Spacing.half,
  },
  closeIcon: {
    fontSize: 20,
    color: '#FFFFFF',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  placeholder: {
    width: 32,
  },
  message: {
    fontSize: 17,
    color: '#8E8E93',
    textAlign: 'center',
    marginTop: Spacing.five,
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.five,
  },
  permissionButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.one,
    borderRadius: 10,
    marginTop: Spacing.four,
  },
  permissionButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '600',
  },
  cameraContainer: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.five,
    paddingVertical: Spacing.four,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  controlsPlaceholder: {
    width: 44,
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  captureButtonDisabled: {
    opacity: 0.5,
  },
  captureButtonInner: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#FFFFFF',
  },
  cameraIcon: {
    fontSize: 48,
    marginBottom: Spacing.four,
  },
});