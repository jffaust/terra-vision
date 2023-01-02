uniform vec3 uSunCenter;
varying float vDistToCenter;

void main() {
  vec3 camToSun = uSunCenter - cameraPosition;
  vec3 nCamToSun = normalize(camToSun);

  float dProd = max(0.0, dot(nCamToSun, normal));
  vDistToCenter = 1. - dProd;

  gl_Position = projectionMatrix *
    modelViewMatrix *
    vec4(position, 1.0);
}