varying vec3 vPosition;

void main() {
  gl_Position = projectionMatrix *
    modelViewMatrix *
    vec4(position, 1.0);

  vPosition = gl_Position.xyz;
}