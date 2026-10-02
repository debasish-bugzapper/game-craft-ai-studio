export interface GraphicsConfig {
  shadowsEnabled: boolean;
  textureQuality: 'ultra' | 'high' | 'medium';
  rayTracing: boolean;
  particleEffects: boolean;
}

export function getRealisticGraphicsPreset(deviceType: 'mobile' | 'desktop'): GraphicsConfig {
  if (deviceType === 'mobile') {
    return {
      shadowsEnabled: true,
      textureQuality: 'high',
      rayTracing: false,
      particleEffects: true
    };
  } else {
    return {
      shadowsEnabled: true,
      textureQuality: 'ultra',
      rayTracing: true,
      particleEffects: true
    };
  }
}
