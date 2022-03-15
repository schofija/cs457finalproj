#version 330 compatibility
in vec3 uColor;

void main()
{
	gl_FragColor = vec4(uColor, 1.);
}