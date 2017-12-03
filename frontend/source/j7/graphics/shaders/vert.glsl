#version 300 es

// an attribute is an input (in) to a vertex shader.
// It will receive data from a buffer
in vec4 a_position;

// LINOTE: uniforms can't be just declared without use below. in which condition
// it seems will be removed due to optimization
// uniform vec4 u_translate;
uniform mat4 u_transform_mat4;

// all shaders have a main function
void main() {

  // gl_Position is a special variable a vertex shader
  // is responsible for setting
  // gl_Position = a_position + u_translate;
  // gl_Position = a_position * u_transform_mat4;
  gl_Position = u_transform_mat4 * a_position;
}
