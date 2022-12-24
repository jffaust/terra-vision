export const sunFragmentShader = `
/*
Copyright (C) 2011 by Ashima Arts (Simplex noise)
Copyright (C) 2011-2016 by Stefan Gustavson (Classic noise and others)
Copyright (c) 2017 Martin Vézina (Sun fragment shader)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/

uniform float aspectRatio;
uniform float sunSize;
uniform float randAngle;
uniform float camAngle;
uniform vec3 sunScreenPos;
varying vec2 vPxScreenPosition;

float noise(vec2 t) {
	return fract(sin(dot(t.xy, vec2(12.9898, 78.233))) * 43758.5453);
}

//noise https://github.com/ashima/webgl-noise

vec2 mod289(vec2 x) {
	return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec3 mod289(vec3 x) {
	return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec4 mod289(vec4 x) {
	return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec4 permute(vec4 x) {
	return mod289(((x*34.0)+1.0)*x);
}

vec3 permute(vec3 x) {
	return mod289(((x*34.0)+1.0)*x);
}

vec4 taylorInvSqrt(vec4 r) {
	return 1.79284291400159 - 0.85373472095314 * r;
}

float snoise(vec2 v) {
	const vec4 C = vec4(0.211324865405187,  // (3.0-sqrt(3.0))/6.0
		0.366025403784439,  // 0.5*(sqrt(3.0)-1.0)
		-0.577350269189626,  // -1.0 + 2.0 * C.x
		0.024390243902439); // 1.0 / 41.0
	// First corner
	vec2 i = floor(v + dot(v, C.yy) );
	vec2 x0 = v - i + dot(i, C.xx);

	// Other corners
	vec2 i1;
	i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
	vec4 x12 = x0.xyxy + C.xxzz;
	x12.xy -= i1;

	i = mod289(i); // Avoid truncation effects in permutation
	vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 )) + i.x + vec3(0.0, i1.x, 1.0 ));

	vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
	m = m * m ;
	m = m * m ;

	// Gradients: 41 points uniformly over a line, mapped onto a diamond.
	// The ring size 17*17 = 289 is close to a multiple of 41 (41*7 = 287)
	vec3 x = 2.0 * fract(p * C.www) - 1.0;
	vec3 h = abs(x) - 0.5;
	vec3 ox = floor(x + 0.5);
	vec3 a0 = x - ox;

	// Normalise gradients implicitly by scaling m
	// Approximation of: m *= inversesqrt( a0*a0 + h*h );
	m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );

	// Compute final noise value at P
	vec3 g;
	g.x  = a0.x  * x0.x  + h.x  * x0.y;
	g.yz = a0.yz * x12.xz + h.yz * x12.yw;
	return 130.0 * dot(m, g);
}

float snoise(vec3 v) { 
	const vec2 C = vec2(1.0/6.0, 1.0/3.0) ;
	const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);

	// First corner
	vec3 i  = floor(v + dot(v, C.yyy) );
	vec3 x0 =   v - i + dot(i, C.xxx) ;

	// Other corners
	vec3 g = step(x0.yzx, x0.xyz);
	vec3 l = 1.0 - g;
	vec3 i1 = min( g.xyz, l.zxy );
	vec3 i2 = max( g.xyz, l.zxy );

	vec3 x1 = x0 - i1 + C.xxx;
	vec3 x2 = x0 - i2 + C.yyy;
	vec3 x3 = x0 - D.yyy;
	// Permutations
	i = mod289(i); 
	vec4 p = permute( permute( permute( 
		i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
		+ i.y + vec4(0.0, i1.y, i2.y, 1.0 )) 
		+ i.x + vec4(0.0, i1.x, i2.x, 1.0 ));

	// Gradients: 7x7 points over a square, mapped onto an octahedron.
	// The ring size 17*17 = 289 is close to a multiple of 49 (49*6 = 294)
	float n_ = 0.142857142857; // 1.0/7.0
	vec3  ns = n_ * D.wyz - D.xzx;

	vec4 j = p - 49.0 * floor(p * ns.z * ns.z);  //  mod(p,7*7)

	vec4 x_ = floor(j * ns.z);
	vec4 y_ = floor(j - 7.0 * x_ );    // mod(j,N)

	vec4 x = x_ * ns.x + ns.yyyy;
	vec4 y = y_ * ns.x + ns.yyyy;
	vec4 h = 1.0 - abs(x) - abs(y);

	vec4 b0 = vec4( x.xy, y.xy );
	vec4 b1 = vec4( x.zw, y.zw );

	//vec4 s0 = vec4(lessThan(b0,0.0))*2.0 - 1.0;
	//vec4 s1 = vec4(lessThan(b1,0.0))*2.0 - 1.0;
	vec4 s0 = floor(b0) * 2.0 + 1.0;
	vec4 s1 = floor(b1) * 2.0 + 1.0;
	vec4 sh = -step(h, vec4(0.0));

	vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy ;
	vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww ;

	vec3 p0 = vec3(a0.xy, h.x);
	vec3 p1 = vec3(a0.zw, h.y);
	vec3 p2 = vec3(a1.xy, h.z);
	vec3 p3 = vec3(a1.zw, h.w);

	//Normalise gradients
	vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
	p0 *= norm.x;
	p1 *= norm.y;
	p2 *= norm.z;
	p3 *= norm.w;

	// Mix final noise value
	vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
	m = m * m;
	return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3) ) );
}

vec3 cc(vec3 color, float factor, float factor2) {
	float w = color.x + color.y + color.z;
	return mix(color, vec3(w) * factor, w * factor2);
}

void main() {

	vec2 fixedPxScreenPosition = vPxScreenPosition;
	fixedPxScreenPosition.x *= aspectRatio;
	vec2 fixedSunScreenPosition = sunScreenPos.xy;
	fixedSunScreenPosition.x *= aspectRatio;

	vec2 main = fixedPxScreenPosition - fixedSunScreenPosition;
	
	float ang = atan(main.x, main.y);
	float dist = length(main);

	//sun disc
	float disc = 1.0 - smoothstep(sunSize * 1.8, sunSize * 2.2, dist); 
	
	
	//base radial gradient
	float brightnessFactor = 0.9;
	float brightness = sunSize * brightnessFactor / dist;
	
	//straight rays extending from the sun
	float raysANoise = snoise(vec3(normalize(main), camAngle + randAngle * 0.8));
	float raysBNoise = snoise(vec3(normalize(main), camAngle + -randAngle * 1.2));

	// float total = brightness + brightness * (sin(rays * 16.0) * .1 + dist * .1 + .8); // original
	float raysA = brightness + brightness * (sin(raysANoise * 8.0) * .1 + dist * .1 + .6);
	float raysB = brightness + brightness * (sin(raysBNoise * 8.0) * .1 + dist * .1 + .6);

	vec2 position = (main / (sunSize * 8.0)) + snoise(vec3(normalize(main), randAngle * 0.9)) * 0.5;
	
	//randomness in the way some of the rays are bright, to form a corona effect
	float distx = length(position);
	float coronaBrightness = clamp((1.0 / (distx * distx) - 0.1) * 0.7, 0.0, 0.8);
	float total = 0.0;
	total += raysA * 0.8 * pow(coronaBrightness, 0.6);
	total += raysB * 0.6;
	// total = brightness;

	vec3 color = vec3(total);
	color += disc;
	//tint color
	color = color * vec3(1.3, 1.03, 0.6);
	// color = color * vec3(0.96, 1.0, 1.2);

	gl_FragColor = vec4(color, color.r);
	
	// vec2 pos =  fixedPxScreenPosition - fixedSunScreenPosition;
	// // vec2 pos = fixedSunScreenPosition;
	// gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
	// gl_FragColor.r = pow(1.0 - abs(pos.x), 100.0);
	// gl_FragColor.g = pow(1.0 - abs(pos.y), 100.0);
	// gl_FragColor.a = gl_FragColor.r + gl_FragColor.g;

	

}
`;