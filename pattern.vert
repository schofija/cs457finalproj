#version 330 compatibility

uniform float EC_eyeposx;
uniform float EC_eyeposy;
uniform float EC_eyeposz;

out vec3 EC_SurfacePosition;
out vec3 EC_EyePosition;
out vec3 EC_SurfaceNormal;
out vec3 EC_LightPosition;
out vec2 vST;

void main()
{
	EC_SurfacePosition = (gl_ModelViewMatrix * gl_Vertex).xyz;
	EC_EyePosition = vec3(EC_eyeposx, EC_eyeposy, EC_eyeposz);
	EC_SurfaceNormal = normalize(gl_NormalMatrix * gl_Normal);
	EC_LightPosition = vec3(0., 5., 0.);
	
	vST = gl_MultiTexCoord0.st;
	
	gl_Position = gl_ModelViewProjectionMatrix * gl_Vertex;
}