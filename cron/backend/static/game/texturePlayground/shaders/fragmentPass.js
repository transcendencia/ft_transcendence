
export let loadingFragmentPass = /* glsl */ `

uniform float uTime;
varying vec2 vUv;

vec3 palette( float t) {
    vec3 a = vec3(0.5, 0.5, 0.5);
    vec3 b = vec3(0.5, 0.5, 0.5);
    vec3 c = vec3(1.0, 1.0, 1.0);
    vec3 d = vec3(0.263, 0.416, 0.557);
    return a + b * sin(6.28318 * (c * t + d));
}

void main() {

    vec3 a = vec3(0.263, 0.416, 0.857);
    vec2 uv = (fract(vUv * uTime * 0.5) - 0.5);
    float d = length(uv) * 2.0;
    vec3 color = palette(d * sin(uTime * 4.));
    // vec3 color = a * d;


    d = sin(d * 8.0 + uTime * 4.) / 8.0; // Added uTime after the +
    d = abs(d);
    d = 0.02 / d;
    color *= d;
    d = pow(d, 1.5);
    gl_FragColor = vec4(color, sin(uTime)); // Output the final color with original alpha
}
`;
export let fragmentPass = /* glsl */ `

uniform float uTime;
varying vec2 vUv;

vec3 palette( float t) {
    vec3 a = vec3(0.5, 0.5, 0.5);
    vec3 b = vec3(0.5, 0.5, 0.5);
    vec3 c = vec3(1.0, 1.0, 1.0);
    vec3 d = vec3(0.263, 0.416, 0.557);
    return a + b * cos(6.28318 * (c * t + d));
}

void main() {
 // TIMESTAMP FOR COOL SHIT: UTIME = 402;
    vec2 uv0 = vUv;
    vec3 finalColor = vec3(0.0);
    
    for (float i = 0.0; i < 4.0; i++) {
        vec2 uv = fract(vUv * 1.5 * sin(uTime * 0.01) * 30.) - 0.5;

        float d = length(uv) * exp(-length(uv0));

        vec3 col = palette(length(uv0) + i * 0.4 + uTime * 0.4);

        d = sin(d * 8.0 - uTime) / 8.0; // Added uTime after the +
        // d = abs(d);

        d = pow(0.01 / d, 1.5);

        finalColor += col * d;
    }

    gl_FragColor = vec4(finalColor, 1.0); // Output the final color with original alpha

}
`;

export let vertexPass = /* glsl */ `
varying vec2 vUv;

void main() {
    vUv = (uv - 0.5) * 2.0;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

