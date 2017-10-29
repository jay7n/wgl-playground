#version 300 es

// an attribute is an input (in) to a vertex shader.
// It will receive data from a buffer
in vec4 a_position;

// Jay7n: uniforms can't be just declared without use below. in which condition
// it seems will be removed due to optimization
uniform vec4 u_translate;

// all shaders have a main function
void main() {

  // gl_Position is a special variable a vertex shader
  // is responsible for setting
  gl_Position = a_position + u_translate;
}
