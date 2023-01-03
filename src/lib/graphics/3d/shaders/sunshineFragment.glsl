varying float vDistToCenter;
// varying vec3 vNormal;
// varying vec3 vLayer0;
// varying vec3 vLayer1;
// varying vec3 vLayer2;
// varying vec3 eyeVector;

// float PI = 3.14159;
// float Fresnel(vec3 eyeVector, vec3 worldNormal) {
//   return pow(1.0 + dot(eyeVector, worldNormal), 3.0);
// }

vec3 brightnessToColor(float b) {
  b *= 0.25;
  return (vec3(b, b * b, b * b * b) / 0.25) * 0.8;
}

void main() {

  float radial = 1. - vDistToCenter;
  radial *= radial;

  float brightness = 4. - 4. * vDistToCenter;

  gl_FragColor.rgb = brightnessToColor(brightness) * radial;
  gl_FragColor.a = radial;

  // gl_FragColor = vec4(0.8, 1., 0., 1.);
  // gl_FragColor = vec4(vPosition.x, 0, 0, 1.);
}