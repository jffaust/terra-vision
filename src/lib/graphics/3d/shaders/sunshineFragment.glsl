varying float vDistToCenter;

vec3 brightnessToColor(float b) {
  b *= 0.25;
  return (vec3(b, b * b, b * b * b) / 0.25) * 0.8;
}

void main() {

  float radial = 1. - vDistToCenter;
  radial *= radial * radial;

  float brightness = 4. - 4. * vDistToCenter;

  gl_FragColor.rgb = brightnessToColor(brightness) * radial;
  gl_FragColor.a = radial;
}