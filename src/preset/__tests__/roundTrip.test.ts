/**
 * Round-Trip Tests
 * 
 * Tests for export → import → export cycle to ensure data integrity.
 */

import { createPresetFromState, importPreset } from '../index';
import type { AppSettings } from '../../constants/defaults';
import { DEFAULT_SETTINGS } from '../../constants/defaults';

/**
 * Test case: Round-trip should preserve all settings
 */
export async function testRoundTrip() {
  const originalSettings: AppSettings = {
    ...DEFAULT_SETTINGS,
    scale: 2.5,
    x: 100,
    y: -50,
    fit: 'contain',
    align: 'top',
    loop: false,
    autoplay: false,
    mute: false,
    resolution: '1280x720',
    backgroundColor: '#FF0000',
    showGuide: false,
  };

  const mediaUrl = 'https://example.com/test-video.mp4';
  const presetName = 'Round Trip Test';

  // Elements to test z-order and state persistence
  const testElements = [
    { id: 'el-1', type: 'text' as const, text: 'Hello', x: 10, y: 10, size: 20 },
    { id: 'el-2', type: 'image' as const, url: 'https://example.com/img.png', x: 50, y: 50, size: 100 },
  ];
  const testZOrder = ['el-2', 'el-1']; // Non-standard order to test stability

  // Step 1: Create preset from state
  // We mock the state elements and z-order by passing them as arguments
  const exportedPreset = createPresetFromState(
    { ...originalSettings, overlay: { mode: 'custom' } } as AppSettings,
    mediaUrl,
    presetName,
    testElements,
    testZOrder
  );

  // Step 2: Simulate import (create a File-like object)
  // In a real test, we would create an actual File object
  // For now, we'll test the import logic directly
  const presetJson = JSON.stringify(exportedPreset);
  const blob = new Blob([presetJson], { type: 'application/json' });
  const file = new File([blob], 'test.nzxt-esc-preset', { type: 'application/json' });

  // Step 3: Import preset
  const importResult = await importPreset(file, 'en');

  if (!importResult.success || !importResult.settings) {
    throw new Error('Import should succeed');
  }

  // Step 4: Compare settings
  const importedSettings = importResult.settings;

  // Compare all fields
  if (importedSettings.scale !== originalSettings.scale) {
    throw new Error(`Scale mismatch: ${importedSettings.scale} !== ${originalSettings.scale}`);
  }

  if (importedSettings.x !== originalSettings.x) {
    throw new Error(`X mismatch: ${importedSettings.x} !== ${originalSettings.x}`);
  }

  if (importedSettings.y !== originalSettings.y) {
    throw new Error(`Y mismatch: ${importedSettings.y} !== ${originalSettings.y}`);
  }

  if (importedSettings.fit !== originalSettings.fit) {
    throw new Error(`Fit mismatch: ${importedSettings.fit} !== ${originalSettings.fit}`);
  }

  if (importedSettings.align !== originalSettings.align) {
    throw new Error(`Align mismatch: ${importedSettings.align} !== ${originalSettings.align}`);
  }

  if (importedSettings.loop !== originalSettings.loop) {
    throw new Error(`Loop mismatch: ${importedSettings.loop} !== ${originalSettings.loop}`);
  }

  if (importedSettings.autoplay !== originalSettings.autoplay) {
    throw new Error(`Autoplay mismatch: ${importedSettings.autoplay} !== ${originalSettings.autoplay}`);
  }

  if (importedSettings.mute !== originalSettings.mute) {
    throw new Error(`Mute mismatch: ${importedSettings.mute} !== ${originalSettings.mute}`);
  }

  if (importedSettings.resolution !== originalSettings.resolution) {
    throw new Error(`Resolution mismatch: ${importedSettings.resolution} !== ${originalSettings.resolution}`);
  }

  if (importedSettings.backgroundColor !== originalSettings.backgroundColor) {
    throw new Error(`Background color mismatch: ${importedSettings.backgroundColor} !== ${originalSettings.backgroundColor}`);
  }

  if (importedSettings.showGuide !== originalSettings.showGuide) {
    throw new Error(`Show guide mismatch: ${importedSettings.showGuide} !== ${originalSettings.showGuide}`);
  }

  // Check media URL
  if (importResult.mediaUrl !== mediaUrl) {
    throw new Error(`Media URL mismatch: ${importResult.mediaUrl} !== ${mediaUrl}`);
  }

  // Check Overlay (extracted from settings or preset)
  const importedOverlay = importResult.settings?.overlay;
  if (!importedOverlay) {
    throw new Error('Imported overlay should not be null');
  }

  if (importedOverlay.mode !== 'custom') {
    throw new Error(`Overlay mode mismatch: ${importedOverlay.mode} !== custom`);
  }

  if (importedOverlay.elements.length !== 2) {
    throw new Error(`Elements length mismatch: ${importedOverlay.elements.length} !== 2`);
  }

  if (!importedOverlay.zOrder || importedOverlay.zOrder.length !== 2) {
    throw new Error('Imported zOrder mismatch or missing');
  }

  if (importedOverlay.zOrder[0] !== 'el-2' || importedOverlay.zOrder[1] !== 'el-1') {
    throw new Error('zOrder sequence not preserved during round-trip');
  }

  console.log('✅ testRoundTrip: PASSED');
}

/**
 * Run all round-trip tests
 */
export async function runRoundTripTests() {
  console.log('🧪 Running Round-Trip Tests...\n');
  
  try {
    await testRoundTrip();
    
    console.log('\n✅ All round-trip tests passed!');
  } catch (error) {
    console.error('\n❌ Round-trip test failed:', error);
    throw error;
  }
}

// Export for manual testing
if (typeof window !== 'undefined') {
  (window as any).runRoundTripTests = runRoundTripTests;
}

