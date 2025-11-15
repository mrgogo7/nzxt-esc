import { useState } from 'react';
import GradientColorPicker from 'react-best-gradient-color-picker';
import { normalizeToRgba } from '../utils/color';
import './styles/TestColorPicker.css';

/**
 * Comprehensive test page for react-best-gradient-color-picker.
 * Access via ?test=1 URL parameter.
 * 
 * Tests ALL package features:
 * - Basic color selection
 * - Alpha control
 * - Gradient control
 * - EyeDropper (if available)
 * - All prop combinations
 * - Direct package usage (no wrapper)
 */
export default function TestColorPicker() {
  // Test 1: Direct package usage - Full features (no wrapper)
  const [directColor1, setDirectColor1] = useState('rgba(255, 0, 0, 1)');
  
  // Test 2: Direct package - Alpha enabled
  const [directColor2, setDirectColor2] = useState('rgba(0, 255, 0, 0.5)');
  
  // Test 3: Direct package - Gradient enabled
  const [directColor3, setDirectColor3] = useState('rgba(0, 0, 255, 1)');
  
  // Test 4: Direct package - Alpha + Gradient enabled
  const [directColor4, setDirectColor4] = useState('rgba(255, 255, 0, 0.8)');
  
  // Test 5: Direct package - All features disabled
  const [directColor5, setDirectColor5] = useState('rgba(128, 128, 128, 1)');
  
  // Test 6: Gradient string test
  const [gradientColor, setGradientColor] = useState('linear-gradient(90deg, rgba(255,0,0,1) 0%, rgba(0,0,255,1) 100%)');

  return (
    <div className="test-color-picker-page">
      <h1>react-best-gradient-color-picker Full Feature Test</h1>
      <p className="test-intro">
        Testing ALL features of the package directly (no wrapper component).
        This helps identify which features work and which don't.
      </p>

      {/* Test 1: Direct Package - Default (all features enabled) */}
      <div className="test-section">
        <h2>Test 1: Direct Package - All Features Enabled (default)</h2>
        <p className="test-description">
          Package with no props - should show alpha, gradient, and eyedropper.
        </p>
        <div className="test-row">
          <div className="test-controls">
            <div className="picker-container">
              <GradientColorPicker
                value={normalizeToRgba(directColor1)}
                onChange={setDirectColor1}
              />
            </div>
            <div className="test-info">
              <p><strong>Current value:</strong> <code>{directColor1}</code></p>
              <p className="test-note">✅ Should show: Alpha slider, Gradient controls, EyeDropper</p>
            </div>
          </div>
          <div 
            className="test-box" 
            style={{ backgroundColor: directColor1 }}
          >
            Preview Box 1
          </div>
        </div>
      </div>

      {/* Test 2: Direct Package - Alpha Only */}
      <div className="test-section">
        <h2>Test 2: Direct Package - Alpha Enabled, Gradient Disabled</h2>
        <p className="test-description">
          hideAlpha=false, hideGradient=true
        </p>
        <div className="test-row">
          <div className="test-controls">
            <div className="picker-container">
              <GradientColorPicker
                value={normalizeToRgba(directColor2)}
                onChange={setDirectColor2}
                hideAlpha={false}
                hideGradient={true}
              />
            </div>
            <div className="test-info">
              <p><strong>Current value:</strong> <code>{directColor2}</code></p>
              <p className="test-note">✅ Should show: Alpha slider, EyeDropper | ❌ Should hide: Gradient</p>
            </div>
          </div>
          <div 
            className="test-box" 
            style={{ backgroundColor: directColor2 }}
          >
            Preview Box 2 (Alpha)
          </div>
        </div>
      </div>

      {/* Test 3: Direct Package - Gradient Only */}
      <div className="test-section">
        <h2>Test 3: Direct Package - Gradient Enabled, Alpha Disabled</h2>
        <p className="test-description">
          hideAlpha=true, hideGradient=false
        </p>
        <div className="test-row">
          <div className="test-controls">
            <div className="picker-container">
              <GradientColorPicker
                value={normalizeToRgba(directColor3)}
                onChange={setDirectColor3}
                hideAlpha={true}
                hideGradient={false}
              />
            </div>
            <div className="test-info">
              <p><strong>Current value:</strong> <code>{directColor3}</code></p>
              <p className="test-note">✅ Should show: Gradient controls, EyeDropper | ❌ Should hide: Alpha slider</p>
            </div>
          </div>
          <div 
            className="test-box" 
            style={{ backgroundColor: directColor3 }}
          >
            Preview Box 3 (Gradient)
          </div>
        </div>
      </div>

      {/* Test 4: Direct Package - Alpha + Gradient */}
      <div className="test-section">
        <h2>Test 4: Direct Package - Alpha + Gradient Enabled</h2>
        <p className="test-description">
          hideAlpha=false, hideGradient=false
        </p>
        <div className="test-row">
          <div className="test-controls">
            <div className="picker-container">
              <GradientColorPicker
                value={normalizeToRgba(directColor4)}
                onChange={setDirectColor4}
                hideAlpha={false}
                hideGradient={false}
              />
            </div>
            <div className="test-info">
              <p><strong>Current value:</strong> <code>{directColor4}</code></p>
              <p className="test-note">✅ Should show: Alpha slider, Gradient controls, EyeDropper</p>
            </div>
          </div>
          <div 
            className="test-box" 
            style={{ backgroundColor: directColor4 }}
          >
            Preview Box 4 (Alpha + Gradient)
          </div>
        </div>
      </div>

      {/* Test 5: Direct Package - All Disabled */}
      <div className="test-section">
        <h2>Test 5: Direct Package - All Features Disabled</h2>
        <p className="test-description">
          hideAlpha=true, hideGradient=true
        </p>
        <div className="test-row">
          <div className="test-controls">
            <div className="picker-container">
              <GradientColorPicker
                value={normalizeToRgba(directColor5)}
                onChange={setDirectColor5}
                hideAlpha={true}
                hideGradient={true}
              />
            </div>
            <div className="test-info">
              <p><strong>Current value:</strong> <code>{directColor5}</code></p>
              <p className="test-note">✅ Should show: Basic color picker, EyeDropper | ❌ Should hide: Alpha, Gradient</p>
            </div>
          </div>
          <div 
            className="test-box" 
            style={{ backgroundColor: directColor5 }}
          >
            Preview Box 5 (Basic)
          </div>
        </div>
      </div>

      {/* Test 6: Gradient String Test */}
      <div className="test-section">
        <h2>Test 6: Gradient String Handling</h2>
        <p className="test-description">
          Test if package returns gradient strings and how we handle them.
        </p>
        <div className="test-row">
          <div className="test-controls">
            <div className="picker-container">
              <GradientColorPicker
                value={gradientColor}
                onChange={setGradientColor}
                hideAlpha={false}
                hideGradient={false}
              />
            </div>
            <div className="test-info">
              <p><strong>Current value:</strong> <code>{gradientColor}</code></p>
              <p className="test-note">⚠️ If gradient string is returned, we extract first color</p>
            </div>
          </div>
          <div 
            className="test-box" 
            style={{ 
              background: gradientColor.includes('gradient') 
                ? gradientColor 
                : gradientColor 
            }}
          >
            Gradient Preview
          </div>
        </div>
      </div>

      {/* Feature Checklist */}
      <div className="test-section">
        <h2>Feature Checklist</h2>
        <div className="checklist">
          <div className="checklist-item">
            <input type="checkbox" id="check-alpha" />
            <label htmlFor="check-alpha">Alpha slider works (when hideAlpha=false)</label>
          </div>
          <div className="checklist-item">
            <input type="checkbox" id="check-gradient" />
            <label htmlFor="check-gradient">Gradient controls work (when hideGradient=false)</label>
          </div>
          <div className="checklist-item">
            <input type="checkbox" id="check-eyedropper" />
            <label htmlFor="check-eyedropper">EyeDropper button works</label>
          </div>
          <div className="checklist-item">
            <input type="checkbox" id="check-rgba-input" />
            <label htmlFor="check-rgba-input">RGBA input field accepts alpha values</label>
          </div>
          <div className="checklist-item">
            <input type="checkbox" id="check-hex-input" />
            <label htmlFor="check-hex-input">HEX input field works</label>
          </div>
          <div className="checklist-item">
            <input type="checkbox" id="check-pointer" />
            <label htmlFor="check-pointer">Color pointer/slider works</label>
          </div>
          <div className="checklist-item">
            <input type="checkbox" id="check-onchange" />
            <label htmlFor="check-onchange">onChange callback fires correctly</label>
          </div>
        </div>
      </div>

      {/* Debug Info */}
      <div className="test-section">
        <h2>Debug Information</h2>
        <div className="debug-info">
          <p><strong>Direct Color 1 (All):</strong> {directColor1}</p>
          <p><strong>Direct Color 2 (Alpha):</strong> {directColor2}</p>
          <p><strong>Direct Color 3 (Gradient):</strong> {directColor3}</p>
          <p><strong>Direct Color 4 (Alpha+Gradient):</strong> {directColor4}</p>
          <p><strong>Direct Color 5 (Basic):</strong> {directColor5}</p>
          <p><strong>Gradient Color:</strong> {gradientColor}</p>
        </div>
      </div>

      {/* Instructions */}
      <div className="test-section">
        <h2>Testing Instructions</h2>
        <ol className="instructions">
          <li>Open each ColorPicker and check which controls are visible</li>
          <li>Test Alpha slider - move it and check if value changes</li>
          <li>Test Gradient controls - click gradient button and create gradient</li>
          <li>Test EyeDropper - click eyedropper button and pick color from screen</li>
          <li>Test RGBA input - manually enter alpha value (e.g., 0.5)</li>
          <li>Test HEX input - manually enter hex value</li>
          <li>Test color pointer - drag on color palette</li>
          <li>Check Debug Info section to see actual values returned</li>
          <li>Mark checklist items as you test</li>
        </ol>
      </div>
    </div>
  );
}
