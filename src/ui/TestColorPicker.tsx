import { useState } from 'react';
import ColorPicker from './components/ColorPicker';
import './styles/TestColorPicker.css';

/**
 * Test page for ColorPicker component.
 * Access via ?test=1 URL parameter.
 * 
 * Tests:
 * - Basic color selection
 * - Alpha control (when allowAlpha=true)
 * - Gradient control (when allowGradient=true)
 * - Popup positioning
 * - Inline mode
 * - RGBA input field
 */
export default function TestColorPicker() {
  // Test 1: Basic color without alpha
  const [color1, setColor1] = useState('rgba(255, 0, 0, 1)');
  
  // Test 2: Color with alpha (allowAlpha=true)
  const [color2, setColor2] = useState('rgba(0, 255, 0, 0.5)');
  
  // Test 3: Background color with gradient
  const [color3, setColor3] = useState('rgba(0, 0, 255, 1)');
  
  // Test 4: Inline picker
  const [color4, setColor4] = useState('rgba(255, 255, 0, 1)');

  return (
    <div className="test-color-picker-page">
      <h1>ColorPicker Test Page</h1>
      <p>Test all ColorPicker functionality before applying to main project.</p>

      {/* Test 1: Basic Color (no alpha, no gradient) */}
      <div className="test-section">
        <h2>Test 1: Basic Color (allowAlpha=false, allowGradient=false)</h2>
        <div className="test-row">
          <div className="test-controls">
            <ColorPicker
              value={color1}
              onChange={setColor1}
              showInline={false}
              allowAlpha={false}
              allowGradient={false}
            />
            <div className="test-info">
              <p>Current value: <code>{color1}</code></p>
            </div>
          </div>
          <div 
            className="test-box" 
            style={{ backgroundColor: color1 }}
          >
            Color Preview
          </div>
        </div>
      </div>

      {/* Test 2: Color with Alpha */}
      <div className="test-section">
        <h2>Test 2: Color with Alpha (allowAlpha=true)</h2>
        <div className="test-row">
          <div className="test-controls">
            <ColorPicker
              value={color2}
              onChange={setColor2}
              showInline={false}
              allowAlpha={true}
              allowGradient={false}
            />
            <div className="test-info">
              <p>Current value: <code>{color2}</code></p>
              <p className="test-warning">⚠️ Alpha slider should work. RGBA input should accept alpha values.</p>
            </div>
          </div>
          <div 
            className="test-box" 
            style={{ backgroundColor: color2 }}
          >
            Color with Alpha Preview
          </div>
        </div>
      </div>

      {/* Test 3: Background Color with Gradient */}
      <div className="test-section">
        <h2>Test 3: Background Color with Gradient (allowGradient=true)</h2>
        <div className="test-row">
          <div className="test-controls">
            <ColorPicker
              value={color3}
              onChange={setColor3}
              showInline={false}
              allowAlpha={false}
              allowGradient={true}
            />
            <div className="test-info">
              <p>Current value: <code>{color3}</code></p>
            </div>
          </div>
          <div 
            className="test-box" 
            style={{ backgroundColor: color3 }}
          >
            Background Color Preview
          </div>
        </div>
      </div>

      {/* Test 4: Inline Picker */}
      <div className="test-section">
        <h2>Test 4: Inline Picker (showInline=true)</h2>
        <div className="test-row">
          <div className="test-controls">
            <ColorPicker
              value={color4}
              onChange={setColor4}
              showInline={true}
              allowAlpha={false}
              allowGradient={false}
            />
            <div className="test-info">
              <p>Current value: <code>{color4}</code></p>
            </div>
          </div>
          <div 
            className="test-box" 
            style={{ backgroundColor: color4 }}
          >
            Inline Picker Preview
          </div>
        </div>
      </div>

      {/* Test 5: Popup Position Test */}
      <div className="test-section">
        <h2>Test 5: Popup Position Test</h2>
        <p>Test popup positioning at different screen locations.</p>
        <div className="position-test-grid">
          <div className="position-test-item">
            <ColorPicker
              value={color1}
              onChange={setColor1}
              showInline={false}
              allowAlpha={false}
              allowGradient={false}
            />
            <span>Top Left</span>
          </div>
          <div className="position-test-item">
            <ColorPicker
              value={color2}
              onChange={setColor2}
              showInline={false}
              allowAlpha={true}
              allowGradient={false}
            />
            <span>Top Right</span>
          </div>
          <div className="position-test-item">
            <ColorPicker
              value={color3}
              onChange={setColor3}
              showInline={false}
              allowAlpha={false}
              allowGradient={true}
            />
            <span>Bottom Left</span>
          </div>
          <div className="position-test-item">
            <ColorPicker
              value={color4}
              onChange={setColor4}
              showInline={false}
              allowAlpha={false}
              allowGradient={false}
            />
            <span>Bottom Right</span>
          </div>
        </div>
      </div>

      {/* Debug Info */}
      <div className="test-section">
        <h2>Debug Information</h2>
        <div className="debug-info">
          <p><strong>Color 1 (Basic):</strong> {color1}</p>
          <p><strong>Color 2 (Alpha):</strong> {color2}</p>
          <p><strong>Color 3 (Gradient):</strong> {color3}</p>
          <p><strong>Color 4 (Inline):</strong> {color4}</p>
        </div>
      </div>
    </div>
  );
}

