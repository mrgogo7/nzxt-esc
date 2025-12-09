/**
 * TransformMatrix.ts
 * 
 * Transform Engine Overview (High-Level)
 * - Pure 2D affine transformation matrix utilities
 * - Matrix math (multiplication, inversion, point transformation)
 * - Behavior is locked (Frozen Zone) after FAZ-6
 * 
 * FROZEN ZONE — DO NOT MODIFY LOGIC
 * 
 * This subsystem is behavior-locked after FAZ-6.
 * Only documentation and type-level improvements allowed.
 * 
 * - Matrix multiplication formulas MUST remain identical
 * - Matrix inversion logic MUST NOT change
 * - Point transformation calculations MUST remain identical
 * 
 * 2D Transform Matrix utilities for TransformEngine v1.
 * 
 * This module provides pure functions for 2D affine transformations using
 * a 3x3 homogeneous coordinate matrix representation:
 * 
 * [a c tx]   [scaleX * cos(θ)  -scaleY * sin(θ)  tx]
 * [b d ty] = [scaleX * sin(θ)   scaleY * cos(θ)   ty]
 * [0 0 1 ]   [0                  0                 1 ]
 * 
 * Where:
 * - a, b, c, d: rotation and scale components
 * - tx, ty: translation components
 * - θ: rotation angle in radians
 * 
 * All transformations are applied in this order:
 * 1. Scale
 * 2. Rotate
 * 3. Translate
 * 
 * This matches CSS transform order: translate → rotate → scale
 * (applied right-to-left in CSS, so written as scale → rotate → translate)
 */

/**
 * 2D Transform Matrix in homogeneous coordinates.
 * Stored as a flat array [a, b, c, d, tx, ty] for efficiency.
 * 
 * Matrix layout:
 * [a  c  tx]
 * [b  d  ty]
 * [0  0  1 ]
 */
export type TransformMatrix = [
  a: number,  // scaleX * cos(θ)
  b: number,  // scaleX * sin(θ)
  c: number,  // -scaleY * sin(θ)
  d: number,  // scaleY * cos(θ)
  tx: number, // translation X
  ty: number  // translation Y
];

/**
 * Creates an identity matrix (no transformation).
 * 
 * @returns Identity matrix
 */
export function createIdentityMatrix(): TransformMatrix {
  return [1, 0, 0, 1, 0, 0];
}

/**
 * Creates a translation matrix.
 * 
 * @param tx - Translation in X direction
 * @param ty - Translation in Y direction
 * @returns Translation matrix
 */
export function createTranslationMatrix(tx: number, ty: number): TransformMatrix {
  return [1, 0, 0, 1, tx, ty];
}

/**
 * Creates a rotation matrix.
 * 
 * @param angle - Rotation angle in degrees
 * @returns Rotation matrix
 */
export function createRotationMatrix(angle: number): TransformMatrix {
  const radians = (angle * Math.PI) / 180;
  const cos = Math.cos(radians);
  const sin = Math.sin(radians);
  return [cos, sin, -sin, cos, 0, 0];
}

/**
 * Creates a scale matrix.
 * 
 * @param sx - Scale factor in X direction
 * @param sy - Scale factor in Y direction (defaults to sx for uniform scaling)
 * @returns Scale matrix
 */
export function createScaleMatrix(sx: number, sy: number = sx): TransformMatrix {
  return [sx, 0, 0, sy, 0, 0];
}

/**
 * Multiplies two transform matrices.
 * 
 * Matrix multiplication: result = m1 * m2
 * This means: apply m2 first, then m1.
 * 
 * @param m1 - First matrix (applied second)
 * @param m2 - Second matrix (applied first)
 * @returns Result matrix
 */
export function multiplyMatrices(
  m1: TransformMatrix,
  m2: TransformMatrix
): TransformMatrix {
  const [a1, b1, c1, d1, tx1, ty1] = m1;
  const [a2, b2, c2, d2, tx2, ty2] = m2;
  
  // Matrix multiplication for 2D affine transforms
  return [
    a1 * a2 + c1 * b2,           // a
    b1 * a2 + d1 * b2,           // b
    a1 * c2 + c1 * d2,           // c
    b1 * c2 + d1 * d2,           // d
    a1 * tx2 + c1 * ty2 + tx1,   // tx
    b1 * tx2 + d1 * ty2 + ty1    // ty
  ];
}

/**
 * Inverts a transform matrix.
 * 
 * For 2D affine transforms, the inverse can be calculated directly:
 * 
 * det = a * d - b * c
 * 
 * Inverse:
 * [d/det  -c/det  (c*ty - d*tx)/det]
 * [-b/det  a/det  (b*tx - a*ty)/det]
 * [0      0       1                ]
 * 
 * @param m - Matrix to invert
 * @returns Inverted matrix, or identity if matrix is singular
 */
export function invertMatrix(m: TransformMatrix): TransformMatrix {
  const [a, b, c, d, tx, ty] = m;
  
  // Calculate determinant
  const det = a * d - b * c;
  
  // Check if matrix is singular (determinant is zero)
  if (Math.abs(det) < 1e-10) {
    // Return identity matrix if singular
    return createIdentityMatrix();
  }
  
  const invDet = 1 / det;
  
  // Calculate inverse
  return [
    d * invDet,                    // a
    -b * invDet,                   // b
    -c * invDet,                   // c
    a * invDet,                    // d
    (c * ty - d * tx) * invDet,   // tx
    (b * tx - a * ty) * invDet    // ty
  ];
}

/**
 * Applies a transform matrix to a point.
 * 
 * @param m - Transform matrix
 * @param x - Point X coordinate
 * @param y - Point Y coordinate
 * @returns Transformed point
 */
export function applyMatrixToPoint(
  m: TransformMatrix,
  x: number,
  y: number
): { x: number; y: number } {
  const [a, b, c, d, tx, ty] = m;
  return {
    x: a * x + c * y + tx,
    y: b * x + d * y + ty
  };
}

/**
 * Applies a transform matrix to a point (inverse transform).
 * 
 * This is useful for converting from global coordinates to local coordinates.
 * 
 * @param m - Transform matrix
 * @param x - Point X coordinate (in global space)
 * @param y - Point Y coordinate (in global space)
 * @returns Transformed point (in local space)
 */
export function applyInverseMatrixToPoint(
  m: TransformMatrix,
  x: number,
  y: number
): { x: number; y: number } {
  const inv = invertMatrix(m);
  return applyMatrixToPoint(inv, x, y);
}

/**
 * Composes multiple transformations into a single matrix.
 * 
 * Transformations are applied in order: first transformation is applied first.
 * 
 * @param matrices - Array of matrices to compose
 * @returns Composed matrix
 */
export function composeMatrices(...matrices: TransformMatrix[]): TransformMatrix {
  if (matrices.length === 0) {
    return createIdentityMatrix();
  }
  
  if (matrices.length === 1) {
    return matrices[0];
  }
  
  // Multiply from right to left (first matrix applied first)
  let result = matrices[0];
  for (let i = 1; i < matrices.length; i++) {
    result = multiplyMatrices(matrices[i], result);
  }
  
  return result;
}

/**
 * Decomposes a transform matrix into translation, rotation, and scale.
 * 
 * This is useful for extracting individual transform components.
 * 
 * @param m - Transform matrix
 * @returns Decomposed transform components
 */
export function decomposeMatrix(m: TransformMatrix): {
  translation: { x: number; y: number };
  rotation: number; // in degrees
  scale: { x: number; y: number };
} {
  const [a, b, c, d, tx, ty] = m;
  
  // Translation is directly available
  const translation = { x: tx, y: ty };
  
  // Scale: sqrt(a² + b²) for X, sqrt(c² + d²) for Y
  const scaleX = Math.sqrt(a * a + b * b);
  const scaleY = Math.sqrt(c * c + d * d);
  
  // Rotation: atan2(b, a) in radians
  // But we need to account for scale, so we normalize first
  const rotationRad = Math.atan2(b / scaleX, a / scaleX);
  const rotation = (rotationRad * 180) / Math.PI;
  
  return {
    translation,
    rotation,
    scale: { x: scaleX, y: scaleY }
  };
}

/**
 * Creates a transform matrix from individual components.
 * 
 * Transformations are applied in order: translate → rotate → scale
 * (which means: scale first, then rotate, then translate in matrix multiplication)
 * 
 * @param translation - Translation component
 * @param rotation - Rotation angle in degrees
 * @param scale - Scale component
 * @returns Composed transform matrix
 */
export function createMatrixFromComponents(
  translation: { x: number; y: number },
  rotation: number,
  scale: { x: number; y: number }
): TransformMatrix {
  const scaleM = createScaleMatrix(scale.x, scale.y);
  const rotateM = createRotationMatrix(rotation);
  const translateM = createTranslationMatrix(translation.x, translation.y);
  
  // Compose: translate * rotate * scale
  // (applied right-to-left, so multiply as: scale → rotate → translate)
  return composeMatrices(translateM, rotateM, scaleM);
}

/**
 * Checks if two matrices are approximately equal (within epsilon).
 * 
 * @param m1 - First matrix
 * @param m2 - Second matrix
 * @param epsilon - Tolerance for comparison (default: 1e-6)
 * @returns True if matrices are approximately equal
 */
export function matricesEqual(
  m1: TransformMatrix,
  m2: TransformMatrix,
  epsilon: number = 1e-6
): boolean {
  for (let i = 0; i < 6; i++) {
    if (Math.abs(m1[i] - m2[i]) > epsilon) {
      return false;
    }
  }
  return true;
}

