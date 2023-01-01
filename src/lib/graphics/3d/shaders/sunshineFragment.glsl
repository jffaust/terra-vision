varying vec4 vPosition;
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

float supersun() {
  float sum = 0.;
  // sum += texturecube(uPerlin, vLayer0).r;
  // sum += texturecube(uPerlin, vLayer1).r;
  // sum += texturecube(uPerlin, vLayer2).r;
  sum *= 0.33;
  return sum;
}

void main() {
  // float brightness = supersun();
  // brightness = brightness * 4. + 1.;

  // float fres = Fresnel(eyeVector, vNormal);
  // brightness += fres;

  // vec3 col = brightnessToColor(brightness);

  float radial = 1. - vPosition.z;
  radial *= radial * radial;

  float brightness = 1. + radial * 0.8;

  gl_FragColor.rgb = brightnessToColor(brightness) * radial;
  gl_FragColor.a = radial;
}