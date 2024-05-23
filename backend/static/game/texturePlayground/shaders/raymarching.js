
export let rayMarchingVertexShader = `

varying vec2 vUv;

void main() {
    vUv = (uv - 0.5) * 2.0;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;


export let rayMarchingFragmentShader = /* glsl */`

varying vec2 vUv;

uniform float uTime;
uniform vec3 cameraPos;
uniform vec3 cameraDir;

#define PI 3.14159265359
#define EPSILON 0.0001



float smin(float a, float b, float k) {
    float h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0);
    return mix(b, a, h) - k * h * (1.0 - h);
}

mat2 rot2d(float angle) {
    float s = sin(angle);
    float c = cos(angle);
    return mat2(c, -s, s, c);
}

float sdSphere(vec3 p, float r) {
    return length(p) - r;
}

float sdEllipsoid(vec3 p, vec3 r) {
    return (length(p / r) - 1.0) * min(min(r.x, r.y), r.z);
}

float sdCappedCylinder( vec3 p, float h, float r )
{
  vec2 d = abs(vec2(length(p.xz),p.y)) - vec2(r,h);
  return min(max(d.x,d.y),0.0) + length(max(d,0.0));
}

float sdBox(vec3 p, vec3 b) {
    vec3 d = abs(p) - b;
    return length(max(d, 0.0)) + min(max(d.x, max(d.y, d.z)), 0.0);
}

float map(vec3 p) {

    // ellipsoid
    vec3 fullBody = p;
    // fract fullbody
    fullBody.x += uTime * 4.;
    fullBody.y += 0.;
    fullBody.x = fract(fullBody).x - .5;

    vec3 q = fullBody;
    q.xy = rot2d( PI / 2.) * q.xy;
    q.z -= 1.0;
    float ellipsoid = sdEllipsoid(q, vec3(1.0, 0.5, 0.25));

    // floor
    float floor = p.y + 4.0;


    // eyes
    vec3 eye1 = vec3(-0.5, 0.5, 0.5);
    vec3 eye2 = vec3(0.5, 0.5, 0.5);
    float eye1Dist = sdSphere(fullBody - eye1, 0.05);
    float eye2Dist = sdSphere(fullBody - eye2, 0.05);

    float ellipsoidEyes = smin(ellipsoid, smin(eye1Dist, eye2Dist, 1.75), 0.1);


    // mouth
    vec3 mouth = vec3(0.0, -0.3, 0.7);
    float mouthDist = sdBox(fullBody - mouth, vec3(0.3, 0.04, 0.1));

    float fullHead = smin(ellipsoidEyes, mouthDist, 0.3);

    // big box
    vec3 boxMovement = p;
    vec3 boxPosition = vec3(0.0, -3.0, 1.6);
    boxMovement.x += sin(uTime * 1.) * 40.;
    boxMovement.y += cos(uTime * 1.) * 5.;
    float bigBox = sdBox(boxMovement - boxPosition, vec3(1.0, 1.0, 1.0));

    // box and head
    // float boxAndHead = smin(bigBox, fullHead, 0.9);


    // cylinder body
    vec3 cylinderBody = vec3(0.0, -1.7, 1.0);
    float cylinderBodyDist = sdCappedCylinder(fullBody - cylinderBody, 1.0, 0.3);
    float cylinderBodyAndHead = smin(cylinderBodyDist, fullHead, 0.1);
    // cylinder arms
    vec3 cylinderArm1 = vec3(-0.8, -1.4, 1.);
    vec3 cylinderArm2 = vec3(0.8, -1.4, 1.);
    vec3 armRotation = fullBody;
    armRotation.xy = rot2d(PI / 4.) * armRotation.xy;
    float cylinderArm1Dist = sdCappedCylinder(armRotation - cylinderArm1, 0.6, 0.1);
    cylinderBodyAndHead = smin(cylinderBodyAndHead, cylinderArm1Dist, 0.3);
    armRotation = fullBody;
    armRotation.xy = rot2d(-PI / 4.) * armRotation.xy;
    float cylinderArm2Dist = sdCappedCylinder(armRotation - cylinderArm2, 0.6, 0.1);
    cylinderBodyAndHead = smin(cylinderBodyAndHead, cylinderArm2Dist, 0.3);

    float boxAndBody = smin(bigBox, cylinderBodyAndHead, 15.9);

    return smin(boxAndBody, floor, 0.9);

}

vec3 estimateNormal(vec3 p) {
    return normalize(vec3(
        map(vec3(p.x + EPSILON, p.y, p.z)) - map(vec3(p.x - EPSILON, p.y, p.z)),
        map(vec3(p.x, p.y + EPSILON, p.z)) - map(vec3(p.x, p.y - EPSILON, p.z)),
        map(vec3(p.x, p.y, p.z + EPSILON)) - map(vec3(p.x, p.y, p.z - EPSILON))
    ));
}

void main() {
    // Initialization
    vec3 ro = cameraPos; // ray origin
    vec3 rd = normalize(cameraDir + vec3(vUv - 0.5, 1)); // ray direction
    vec3 col = vec3(0); // colors

    float t = 0.0; // distance traveled

    // Raymarching
    for (int i = 0; i < 100; i++) {
        vec3 p = ro + rd * t;
        float d = map(p);
        t += d;
        if (d < .01 || t > 100.0) break;
    }

    // Calculate color based on distance
    vec3 p = ro + rd * t;
    vec3 normal = estimateNormal(p);
    
    // Simple Phong lighting model
    vec3 lightPos = vec3(-5.0, 5.0, -5.0);
    vec3 lightDir = normalize(lightPos - p);
    
    // Ambient component
    vec3 ambient = 0.4 * vec3(1.0, 0.0, 1.0);
    
    // Diffuse component
    float diff = max(dot(normal, lightDir), 0.0);
    vec3 diffuse = diff * vec3(1.);
    
    // Specular component
    vec3 viewDir = normalize(-p);
    vec3 reflectDir = reflect(-lightDir, normal);
    float spec = pow(max(dot(viewDir, reflectDir), 0.0), 32.0);
    vec3 specular = spec * vec3(1.0, 1.0, 1.0);
    
    // Combine the components
    col = ambient + diffuse + specular;

    gl_FragColor = vec4(col, 1.0);
}
`;

