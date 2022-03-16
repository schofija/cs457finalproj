#version 330 compatibility

in vec3 vECpos;
in vec4 vColor;
in float vLightIntensity;

uniform int uNumFacets;
uniform float uPower;
uniform float uTimer;
uniform float uRotateSpeed;
uniform float uBallX;
uniform float uBallY;
uniform float uBallZ;
uniform float uShininess;

uniform bool uDrawPointLight;
uniform float uPointR;
uniform float uPointB;
uniform float uPointG;
flat in vec3 vNf;
in vec3 vNs;
flat in vec3 vLf;
in vec3 vLs;
flat in vec3 vEf;
in vec3 vEs;

const float PI = 3.14159265;
const vec3 LIGHTPOS2 = vec3(2., 2., 0.);
const vec3 LIGHTCOLOR = vec3(1., 0., 0.);

const float uKa = .1;
const float uKd = 1.;
const float uKs = 1.;
//const float uShininess = 10.;
const float uFreq = 1.;

uniform sampler2D Color_Map;
uniform sampler2D Normal_Map;

in vec3 EC_SurfacePosition;
in vec3 EC_EyePosition;
in vec3 EC_SurfaceNormal;
in vec3 EC_LightPosition;
in vec2 vST;

void main( void )
{       
	vec3 pointambient;
	vec3 pointdiffuse;
	vec3 pointspecular;
	
	vec3 Normal;
	vec3 Light;
	vec3 Eye;
	if(uDrawPointLight)
	{
		Normal = normalize(vNs);
		Light = normalize(vLs);
		Eye = normalize(vEs);
		
		float d = max(dot(Normal, Light), 0.);
		pointdiffuse = uKd/2 * d * vec3(uPointR, uPointG, uPointB);
		
		float s = 0.;
		if( dot(Normal,Light)  >  0. )// only do specular if the light can see the point
		{
			vec3 ref = normalize( 2. * Normal * dot(Normal,Light) - Light );
			s = pow( max( dot(Eye,ref),0. ), uShininess );
		}
		
		pointspecular = uKs * s * vec3(uPointR, uPointG, uPointB);
	}
	

	vec3 BALLPOS2 = vec3(uBallX, uBallY, uBallZ);
	vec3 BALLPOS = (gl_ModelViewMatrix * vec4(BALLPOS2, 1.)).xyz;
	vec3 LIGHTPOS = (gl_ModelViewMatrix * vec4(LIGHTPOS2, 1.)).xyz;

	int numTheta = uNumFacets;// # in longitude direction
	int numPhi  = uNumFacets;// # in latitude direction
	float dtheta = 2. * PI / float(numTheta);
	float dphi =         PI / float(numPhi);// spherical coord angles between the facets

	vec3 BP = normalize(vECpos - BALLPOS);										
	float angle = radians(uTimer*360.*uRotateSpeed);// ball rotation angle (if you multiply this it scales rotation speed)
	float c = cos( angle );
	float s = sin( angle );
	vec3 bp;
	bp.x =  c*BP.x + s*BP.z;
	bp.y =  BP.y;
	bp.z = -s*BP.x + c*BP.z;// but, rotate the vector, not the ball

	vec3 BL = normalize( LIGHTPOS - BALLPOS);
	vec3  H = normalize( BL + bp  );// vector halfway between BL and bp – if a facet aligns with this angle

	float xz  = length( H.xz );
	float phi    = atan( H.y, xz );
	float theta = atan( H.z, H.x );// turn the H vector into spherical coordinates
	int itheta = int( floor(  ( theta + dtheta/2. ) / dtheta ) );
	int iphi  = int( floor(  ( phi   + dphi/2.   )    / dphi  ) );
	float theta0 = dtheta * float(itheta);
	float phi0    = dphi  * float(iphi);// figure out what the closest facet to H is
	vec3 N0;
	N0.y = sin(phi0);xz  = cos(phi0);
	N0.x = xz*cos(theta0);
	N0.z = xz*sin(theta0);// N0 is the discrete facet normal vector
	float d = max( dot( N0, H ), 0. );  // like the cone angle on a spotlight
	const float DMIN = 0.990;// acos(0.990) is about 8 degrees
	if( d < DMIN )
		d = 0.;
	d = pow( d, uPower );// specular brightness
	
	/* Normal Mapping...*/
	vec3 P = EC_SurfacePosition;
	vec3 E = normalize( EC_EyePosition - EC_SurfacePosition );
	vec3 N = normalize( gl_NormalMatrix * (2.*texture( Normal_Map, uFreq*vST ).xyz - vec3(1.,1.,1.) ) );
	vec3 L = EC_LightPosition - P;

	vec3 Ambient_Color = uKa * texture( Color_Map, uFreq * vST ).rgb;
	float Light_Intensity = 1.;
	L = normalize( EC_LightPosition - P );
	float Diffuse_Intensity = dot( N, L ) * Light_Intensity;
	vec3 Diffuse_Color = uKd * Diffuse_Intensity * texture( Color_Map, uFreq * vST ).rgb;
	float Specular_Intensity = pow( max( dot( reflect( -L, N ), E ), 0. ), uShininess ) * Light_Intensity;
	vec3 Specular_Color = uKs * Specular_Intensity * vec3( 1., 1., 1. );
	//vLightIntensity + d * lightcolor
	if(uDrawPointLight)
		gl_FragColor = vec4((vLightIntensity + d * LIGHTCOLOR * -1.)*Diffuse_Color*pointdiffuse + Ambient_Color + Specular_Color + pointspecular, 1. );
	else
		gl_FragColor = vec4((vLightIntensity + d * LIGHTCOLOR * -1.)*Diffuse_Color + Ambient_Color + Specular_Color, 1. );
	}