export type DeviceMode = 'mobile' | 'desktop' | 'auto';

export interface DeviceLayoutConfig {
  mode: DeviceMode;
  canvasWidth: string;
  canvasHeight: string;
  isTouchOptimized: boolean;
}

export function getDeviceLayoutConfig(selectedMode: DeviceMode): DeviceLayoutConfig {
  // Agar user ne 'auto' rakha hai toh screen width ke mutabiq decide hoga
  const isMobileScreen = window.innerWidth <= 768;
  const effectiveMode = selectedMode === 'auto' ? (isMobileScreen ? 'mobile' : 'desktop') : selectedMode;

  if (effectiveMode === 'mobile') {
    return {
      mode: 'mobile',
      canvasWidth: '100%',
      canvasHeight: '85vh',
      isTouchOptimized: true
    };
  } else {
    return {
      mode: 'desktop',
      canvasWidth: '1280px',
      canvasHeight: '720px',
      isTouchOptimized: false
    };
  }
}

export function saveUserDevicePreference(mode: DeviceMode): void {
  localStorage.setItem('preferred_device_mode', mode);
}

export function getUserDevicePreference(): DeviceMode {
  return (localStorage.getItem('preferred_device_mode') as DeviceMode) || 'auto';
}
