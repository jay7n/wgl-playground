#version 300 es

// an attribute is an input (in) to a vertex shader.
// It will receive data from a buffer
in vec4 a_position;

// LINOTE: uniforms can't be just declared without use below. in which condition
// it seems will be removed due to optimization
// uniform vec4 u_translate;
uniform mat4 u_transform_mat4;
uniform mat4 u_view_mat4;
uniform mat4 u_perspective_projection_mat4;

// all shaders have a main function
void main() {

  // gl_Position is a special variable a vertex shader
  // is responsible for setting
  // gl_Position = a_position + u_translate;
  // gl_Position = a_position * u_transform_mat4;
  mat4 test = u_perspective_projection_mat4;
  mat4 test2 = inverse(u_view_mat4);
  mat4 test3 = u_transform_mat4;
  // gl_Position = a_position * u_transform_mat4 * inverse(u_view_mat4) * u_perspective_projection_mat4;
  gl_Position = u_perspective_projection_mat4 * inverse(u_view_mat4) * u_transform_mat4 * a_position;
}
