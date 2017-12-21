#version 300 es

// fragment shaders don't have a default precision so we need
// to pick one. mediump is a good default. It means "medium precision"
precision mediump float;

in vec3 v_baryCenter;

// we need to declare an output for the fragment shader
out vec4 outColor;

void main() {
  // Just set the output to a constant redish-purple
  if(any(lessThan(v_baryCenter, vec3(0.003)))){
      outColor = vec4(1, 0, 0.5, 1);
  } else {
      outColor = vec4(0, 0, 0, 0.5);
  }
}
