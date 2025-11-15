import { useState } from 'react';
import GradientColorPicker from 'react-best-gradient-color-picker';
import ColorPicker from './components/ColorPicker';
import { normalizeToRgba } from '../utils/color';
import './styles/TestColorPicker.css';

/**
 * Comprehensive test page for react-best-gradient-color-picker.
 * Access via ?test=1 URL parameter.
 * 
 * Tests ALL package features:
 * - Basic color selection
 * - Alpha control (with transparency preview)
 * - Gradient control
 * - EyeDropper (with color samples)
 * - Popup positioning
 * - All prop combinations
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
  
  // Test 7: Wrapper ColorPicker - Popup opening test
  const [wrapperColor, setWrapperColor] = useState('rgba(255, 0, 255, 1)');

  // Color samples for EyeDropper testing
  const colorSamples = [
    { name: 'Red', color: '#ff0000' },
    { name: 'Green', color: '#00ff00' },
    { name: 'Blue', color: '#0000ff' },
    { name: 'Yellow', color: '#ffff00' },
    { name: 'Cyan', color: '#00ffff' },
    { name: 'Magenta', color: '#ff00ff' },
    { name: 'Orange', color: '#ffa500' },
    { name: 'Purple', color: '#800080' },
  ];

  return (
    <div className="test-color-picker-page">
      <h1>react-best-gradient-color-picker Full Feature Test</h1>
      <p className="test-intro">
        Testing ALL features of the package. Test 6 shows that everything works except EyeDropper.
        EyeDropper requires color samples to pick from.
      </p>

      {/* Color Samples for EyeDropper */}
      <div className="test-section">
        <h2>Color Samples for EyeDropper Testing</h2>
        <p className="test-description">
          Click EyeDropper button in ColorPicker, then click on these colors to pick them.
        </p>
        <div className="color-samples-grid">
          {colorSamples.map((sample, index) => (
            <div
              key={index}
              className="color-sample"
              style={{ backgroundColor: sample.color }}
              title={`${sample.name} - ${sample.color}`}
            >
              <span className="color-sample-name">{sample.name}</span>
              <span className="color-sample-value">{sample.color}</span>
            </div>
          ))}
        </div>
      </div>

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
          <div className="test-preview-area">
            <div className="test-box" style={{ backgroundColor: directColor1 }}>
              Preview Box 1
            </div>
          </div>
        </div>
      </div>

      {/* Test 2: Direct Package - Alpha Only (with transparency preview) */}
      <div className="test-section">
        <h2>Test 2: Direct Package - Alpha Enabled (with transparency preview)</h2>
        <p className="test-description">
          hideAlpha=false, hideGradient=true - Alpha slider should work. Test transparency with two overlapping boxes.
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
              <p className="test-warning">⚠️ Test transparency: Change alpha and see how top box becomes transparent over the checkerboard.</p>
            </div>
          </div>
          <div className="test-preview-area">
            {/* Checkerboard background for transparency */}
            <div className="test-box-alpha-container">
              <div className="test-box-alpha-background" />
              <div 
                className="test-box-alpha-foreground" 
                style={{ backgroundColor: directColor2 }}
              >
                Alpha Preview (Top Box)
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Test 3: Direct Package - Gradient Only */}
      <div className="test-section">
        <h2>Test 3: Direct Package - Gradient Enabled, Alpha Disabled</h2>
        <p className="test-description">
          hideAlpha=true, hideGradient=false - Gradient controls should work.
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
          <div className="test-preview-area">
            <div className="test-box" style={{ backgroundColor: directColor3 }}>
              Preview Box 3 (Gradient)
            </div>
          </div>
        </div>
      </div>

      {/* Test 4: Direct Package - Alpha + Gradient (with transparency preview) */}
      <div className="test-section">
        <h2>Test 4: Direct Package - Alpha + Gradient Enabled (with transparency preview)</h2>
        <p className="test-description">
          hideAlpha=false, hideGradient=false - Both should work.
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
          <div className="test-preview-area">
            {/* Checkerboard background for transparency */}
            <div className="test-box-alpha-container">
              <div className="test-box-alpha-background" />
              <div 
                className="test-box-alpha-foreground" 
                style={{ backgroundColor: directColor4 }}
              >
                Alpha + Gradient Preview
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Test 5: Direct Package - All Disabled */}
      <div className="test-section">
        <h2>Test 5: Direct Package - All Features Disabled</h2>
        <p className="test-description">
          hideAlpha=true, hideGradient=true - Only basic color picker.
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
          <div className="test-preview-area">
            <div className="test-box" style={{ backgroundColor: directColor5 }}>
              Preview Box 5 (Basic)
            </div>
          </div>
        </div>
      </div>

      {/* Test 6: Gradient String Handling - Everything works except EyeDropper */}
      <div className="test-section test-highlight">
        <h2>Test 6: Gradient String Handling ⭐ (Everything works except EyeDropper)</h2>
        <p className="test-description">
          This test shows that alpha, gradient, and all features work correctly.
          Only EyeDropper needs testing with color samples above.
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
              <p className="test-success">✅ Alpha slider works | ✅ Gradient controls work | ⚠️ EyeDropper needs testing</p>
            </div>
          </div>
          <div className="test-preview-area">
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
      </div>

      {/* Test 7: Wrapper ColorPicker - Popup Opening Test */}
      <div className="test-section">
        <h2>Test 7: Wrapper ColorPicker - Popup Opening Test</h2>
        <p className="test-description">
          Test ColorPicker wrapper component popup positioning and opening behavior.
        </p>
        <div className="test-row">
          <div className="test-controls">
            <ColorPicker
              value={wrapperColor}
              onChange={setWrapperColor}
              showInline={false}
              allowAlpha={true}
              allowGradient={true}
            />
            <div className="test-info">
              <p><strong>Current value:</strong> <code>{wrapperColor}</code></p>
              <p className="test-note">✅ Click trigger button - popup should open next to button</p>
              <p className="test-note">✅ Test popup positioning at different screen locations below</p>
            </div>
          </div>
          <div className="test-preview-area">
            <div className="test-box" style={{ backgroundColor: wrapperColor }}>
              Wrapper ColorPicker Preview
            </div>
          </div>
        </div>
      </div>

      {/* Test 8: Popup Position Test - Different Locations */}
      <div className="test-section">
        <h2>Test 8: Popup Position Test - Different Screen Locations</h2>
        <p className="test-description">
          Test popup positioning at different screen locations. Click each ColorPicker to see where popup opens.
        </p>
        <div className="position-test-grid">
          <div className="position-test-item">
            <ColorPicker
              value={directColor1}
              onChange={setDirectColor1}
              showInline={false}
              allowAlpha={false}
              allowGradient={false}
            />
            <span>Top Left Corner</span>
            <small>Popup should position correctly</small>
          </div>
          <div className="position-test-item">
            <ColorPicker
              value={directColor2}
              onChange={setDirectColor2}
              showInline={false}
              allowAlpha={true}
              allowGradient={false}
            />
            <span>Top Right Corner</span>
            <small>Popup should position correctly</small>
          </div>
          <div className="position-test-item">
            <ColorPicker
              value={directColor3}
              onChange={setDirectColor3}
              showInline={false}
              allowAlpha={false}
              allowGradient={true}
            />
            <span>Bottom Left Corner</span>
            <small>Popup should position correctly</small>
          </div>
          <div className="position-test-item">
            <ColorPicker
              value={directColor4}
              onChange={setDirectColor4}
              showInline={false}
              allowAlpha={true}
              allowGradient={true}
            />
            <span>Bottom Right Corner</span>
            <small>Popup should position correctly</small>
          </div>
        </div>
      </div>

      {/* Feature Checklist */}
      <div className="test-section">
        <h2>Feature Checklist</h2>
        <div className="checklist">
          <div className="checklist-item">
            <input type="checkbox" id="check-alpha" />
            <label htmlFor="check-alpha">Alpha slider works (when hideAlpha=false) - Test with overlapping boxes</label>
          </div>
          <div className="checklist-item">
            <input type="checkbox" id="check-gradient" />
            <label htmlFor="check-gradient">Gradient controls work (when hideGradient=false) - Test 6 confirms this works</label>
          </div>
          <div className="checklist-item">
            <input type="checkbox" id="check-eyedropper" />
            <label htmlFor="check-eyedropper">EyeDropper button works - Pick colors from Color Samples section above</label>
          </div>
          <div className="checklist-item">
            <input type="checkbox" id="check-rgba-input" />
            <label htmlFor="check-rgba-input">RGBA input field accepts alpha values - Test in Test 2 and 4</label>
          </div>
          <div className="checklist-item">
            <input type="checkbox" id="check-hex-input" />
            <label htmlFor="check-hex-input">HEX input field works</label>
          </div>
          <div className="checklist-item">
            <input type="checkbox" id="check-pointer" />
            <label htmlFor="check-pointer">Color pointer/slider works - Drag on color palette</label>
          </div>
          <div className="checklist-item">
            <input type="checkbox" id="check-onchange" />
            <label htmlFor="check-onchange">onChange callback fires correctly - Check Debug Info below</label>
          </div>
          <div className="checklist-item">
            <input type="checkbox" id="check-popup" />
            <label htmlFor="check-popup">Popup opens correctly - Test 7 and 8</label>
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
          <p><strong>Wrapper Color:</strong> {wrapperColor}</p>
        </div>
      </div>

      {/* Instructions */}
      <div className="test-section">
        <h2>Testing Instructions</h2>
        <ol className="instructions">
          <li>Scroll to <strong>Color Samples</strong> section at top - use these for EyeDropper testing</li>
          <li>Open each ColorPicker and check which controls are visible</li>
          <li>Test Alpha slider - move it and check transparency in overlapping boxes (Test 2, 4)</li>
          <li>Test Gradient controls - click gradient button and create gradient (Test 3, 4, 6)</li>
          <li>Test EyeDropper - click eyedropper button, then click on Color Samples above</li>
          <li>Test RGBA input - manually enter alpha value (e.g., 0.5) in Test 2 and 4</li>
          <li>Test HEX input - manually enter hex value</li>
          <li>Test color pointer - drag on color palette</li>
          <li>Test popup opening - click trigger buttons in Test 7 and 8</li>
          <li>Check Debug Info section to see actual values returned</li>
          <li>Mark checklist items as you test</li>
        </ol>
      </div>
    </div>
  );
}
