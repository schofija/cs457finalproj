#version 330 compatibility

/* Discoball Lighting*/
out vec3 vECpos;
out vec4 vColor;
out float vLightIntensity;

/* Normal-mapping */
out vec3 EC_SurfacePosition;
out vec3 EC_EyePosition;
out vec3 EC_SurfaceNormal;
out vec3 EC_LightPosition;
out vec2 vST;

const vec3 LIGHTPOS2 = vec3(2., 2., 0.);

void main()
{
	vec3 LIGHTPOS = (gl_ModelViewMatrix * vec4(LIGHTPOS2, 1.)).xyz;
	/* Disco ball lighting */
	vECpos = (gl_ModelViewMatrix * gl_Vertex).xyz;
	vec3 tnorm = normalize(vec3(gl_NormalMatrix*gl_Normal));
	vLightIntensity = dot(normalize(LIGHTPOS - vECpos), tnorm);
	vLightIntensity = abs(vLightIntensity);
	vColor = vec4(1., 0.25, 0.25, 1.);
	
	/* Normal-mapping */
	EC_SurfacePosition = (gl_ModelViewMatrix * gl_Vertex).xyz;
	EC_EyePosition = vec3(0., 0., 0.);
	EC_SurfaceNormal = normalize(gl_NormalMatrix * gl_Normal);
	EC_LightPosition = vec3(0., 5., 0.);
	
	vST = gl_MultiTexCoord0.st;
	
	gl_Position = gl_ModelViewProjectionMatrix * gl_Vertex ;
}