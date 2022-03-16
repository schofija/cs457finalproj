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


uniform float uPointLightX;
uniform float uPointLightY;
uniform float uPointLightZ;
vec3 eyeLightPosition = vec3(uPointLightX, uPointLightY, uPointLightZ);
flat out vec3 vNf;
out vec3 vNs;
flat out vec3 vLf;
out vec3 vLs;
flat out vec3 vEf;
out vec3 vEs;
void main()
{

	/* Point light */
	vec4 ECposition = gl_ModelViewMatrix * gl_Vertex;
	vNf = normalize( gl_NormalMatrix* gl_Normal );
	vNs = vNf;
	
	vLf = eyeLightPosition - ECposition.xyz;   // vector from the point
	vLs = vLf; 
	
	vEf = vec3( 0., 0., 0. ) - ECposition.xyz;
	vEs = vEf;
	
	
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