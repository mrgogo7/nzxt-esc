/**
 * Preset Migration Tests
 * 
 * Tests for sequential migration pipeline.
 * 
 * Note: These are manual test cases. For automated testing,
 * install a test framework like Vitest or Jest.
 */

import { migratePreset, getSchemaVersion } from '../migration';
import { CURRENT_SCHEMA_VERSION } from '../constants';

/**
 * Test case: Migrate version 0 to version 1
 */
export function testMigrate0To1() {
  const v0File = {
    exportedAt: '2024-01-01T00:00:00.000Z',
    appVersion: '0.0.1',
    background: {
      url: 'https://example.com/video.mp4',
      settings: {
        scale: 1.5,
        x: 10,
        y: 20,
        fit: 'cover',
        align: 'center',
        loop: true,
        autoplay: true,
        mute: true,
        resolution: '640x640',
        backgroundColor: '#000000',
      },
    },
    overlay: {
      mode: 'none',
      elements: [],
    },
  };

  const migrated = migratePreset(v0File);

  // Assertions
  if (migrated.schemaVersion !== CURRENT_SCHEMA_VERSION) {
    throw new Error(`Expected schemaVersion ${CURRENT_SCHEMA_VERSION}, got ${migrated.schemaVersion}`);
  }

  if (!migrated.presetName) {
    throw new Error('Expected presetName to be set');
  }

  if (migrated.background.settings.scale !== 1.5) {
    throw new Error('Scale value should be preserved');
  }

  console.log('✅ testMigrate0To1: PASSED');
}

/**
 * Test case: Migrate version 1 to version 2
 */
export function testMigrate1To2() {
  const v1File = {
    schemaVersion: 1,
    exportedAt: '2024-01-01T00:00:00.000Z',
    appVersion: '1.0.0',
    presetName: 'V1 Test',
    background: {
      url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      settings: {
        scale: 1.0,
        x: 0,
        y: 0,
        fit: 'cover',
        align: 'center',
        loop: true,
        autoplay: true,
        mute: true,
        resolution: '640x640',
        backgroundColor: '#000000',
      },
    },
    overlay: {
      mode: 'none',
      elements: [],
    },
  };

  const migrated = migratePreset(v1File);

  // Assertions
  if (migrated.schemaVersion !== CURRENT_SCHEMA_VERSION) {
    throw new Error(`Expected schemaVersion ${CURRENT_SCHEMA_VERSION}, got ${migrated.schemaVersion}`);
  }

  const bg = migrated.background as any;
  if (!bg.source || bg.source.type !== 'youtube' || bg.source.url !== v1File.background.url) {
    throw new Error('Should derive YouTube source from URL in v2 migration');
  }

  console.log('✅ testMigrate1To2: PASSED');
}

/**
 * Test case: Migrate version 2 to version 3
 */
export function testMigrate2To3() {
  const v2File = {
    schemaVersion: 2,
    exportedAt: '2024-01-01T00:00:00.000Z',
    appVersion: '2.0.0',
    presetName: 'V2 Test',
    background: {
      url: 'https://example.com/image.png',
      source: { type: 'remote', url: 'https://example.com/image.png' },
      settings: {
        scale: 1.0,
        x: 0,
        y: 0,
        fit: 'cover',
        align: 'center',
        loop: true,
        autoplay: true,
        mute: true,
        resolution: '640x640',
        backgroundColor: '#000000',
      },
    },
    overlay: {
      mode: 'custom',
      elements: [
        { id: 'el-1', type: 'text', text: 'One' },
        { id: 'el-2', type: 'text', text: 'Two' },
      ],
    },
  };

  const migrated = migratePreset(v2File);

  // Assertions
  if (migrated.schemaVersion !== 3) {
    throw new Error(`Expected schemaVersion 3, got ${migrated.schemaVersion}`);
  }

  if (!migrated.overlay.zOrder || !Array.isArray(migrated.overlay.zOrder)) {
    throw new Error('Should have zOrder array in v3 migration');
  }

  if (migrated.overlay.zOrder.length !== 2) {
    throw new Error(`Expected zOrder length 2, got ${migrated.overlay.zOrder.length}`);
  }

  if (migrated.overlay.zOrder[0] !== 'el-1' || migrated.overlay.zOrder[1] !== 'el-2') {
    throw new Error('zOrder elements should match element IDs and order');
  }

  console.log('✅ testMigrate2To3: PASSED');
}

/**
 * Test case: Handle missing fields gracefully
 */
export function testMissingFields() {
  const incompleteFile = {
    schemaVersion: 0,
    background: {
      url: '',
      settings: {},
    },
  };

  const migrated = migratePreset(incompleteFile);

  // Should not throw, should use defaults
  if (migrated.schemaVersion !== CURRENT_SCHEMA_VERSION) {
    throw new Error(`Expected schemaVersion ${CURRENT_SCHEMA_VERSION}, got ${migrated.schemaVersion}`);
  }

  if (typeof migrated.background.settings.scale !== 'number') {
    throw new Error('Scale should have default value');
  }

  console.log('✅ testMissingFields: PASSED');
}

/**
 * Test case: Idempotent migration (running migration twice should produce same result)
 */
export function testIdempotentMigration() {
  const v0File = {
    exportedAt: '2024-01-01T00:00:00.000Z',
    appVersion: '0.0.1',
    background: {
      url: 'https://example.com/video.mp4',
      settings: {
        scale: 2.0,
        x: 0,
        y: 0,
        fit: 'cover',
        align: 'center',
        loop: true,
        autoplay: true,
        mute: true,
        resolution: '640x640',
        backgroundColor: '#000000',
      },
    },
    overlay: {
      mode: 'none',
      elements: [],
    },
  };

  const firstMigration = migratePreset(v0File);
  const secondMigration = migratePreset(firstMigration);

  // Should produce same result
  if (firstMigration.schemaVersion !== secondMigration.schemaVersion) {
    throw new Error('Migration should be idempotent');
  }

  if (firstMigration.background.settings.scale !== secondMigration.background.settings.scale) {
    throw new Error('Values should be preserved in idempotent migration');
  }

  console.log('✅ testIdempotentMigration: PASSED');
}

/**
 * Test case: Version detection
 */
export function testVersionDetection() {
  const v0File = {};
  const v1File = { schemaVersion: 1 };

  if (getSchemaVersion(v0File) !== 0) {
    throw new Error('Should detect version 0 for missing schemaVersion');
  }

  if (getSchemaVersion(v1File) !== 1) {
    throw new Error('Should detect version 1');
  }

  console.log('✅ testVersionDetection: PASSED');
}

/**
 * Run all migration tests
 */
export function runMigrationTests() {
  console.log('🧪 Running Migration Tests...\n');
  
  try {
    testMigrate0To1();
    testMigrate1To2();
    testMigrate2To3();
    testMissingFields();
    testIdempotentMigration();
    testVersionDetection();
    
    console.log('\n✅ All migration tests passed!');
  } catch (error) {
    console.error('\n❌ Migration test failed:', error);
    throw error;
  }
}

// Export for manual testing
if (typeof window !== 'undefined') {
  (window as any).runMigrationTests = runMigrationTests;
}

