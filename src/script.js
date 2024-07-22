import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import GUI from "lil-gui";

// const realSunRadiusRatio = 6.9;

const initialCameraPosition = new THREE.Vector3(0, 100, 0);

let cameraTarget = {
  position: new THREE.Vector3(0, 0, 0),
  planet: null,
  speed: 0.05,
};

const planet = {
  sun: {
    반지름: 15,
    자전속도: ((Math.PI * 2) / (26 * 24)) * 5,
  },
  mercury: {
    태양과의거리: 15 + 5.8,
    반지름: 0.24,
    자전속도: ((Math.PI * 2) / 58) * 5,
    공전속도: ((Math.PI * 2) / (88 * 24)) * 500,
    자전방향: -1,
    공전방향: -1,
  },
  venus: {
    태양과의거리: 15 + 10.8,
    반지름: 0.6,
    자전속도: ((Math.PI * 2) / (243 * 24)) * 5,
    공전속도: ((Math.PI * 2) / (225 * 24)) * 500,
    자전방향: 1,
    공전방향: -1,
  },
  earth: {
    태양과의거리: 15 + 14.9,
    반지름: 0.64,
    자전속도: ((Math.PI * 2) / 24) * 5,
    공전속도: ((Math.PI * 2) / (365 * 24)) * 500,
    자전방향: -1,
    공전방향: -1,
  },
  mars: {
    태양과의거리: 15 + 22.7,
    반지름: 0.34,
    자전속도: ((Math.PI * 2) / 24) * 5,
    공전속도: ((Math.PI * 2) / (687 * 24)) * 500,
    자전방향: -1,
    공전방향: -1,
  },
  jupiter: {
    태양과의거리: 15 + 77.8,
    반지름: 7,
    자전속도: ((Math.PI * 2) / 10) * 5,
    공전속도: ((Math.PI * 2) / (4332 * 24)) * 500,
    자전방향: -1,
    공전방향: -1,
  },
  saturn: {
    태양과의거리: 15 + 142,
    반지름: 6,
    자전속도: ((Math.PI * 2) / 10) * 5,
    공전속도: ((Math.PI * 2) / (10759 * 24)) * 500,
    자전방향: -1,
    공전방향: -1,
  },
  uranus: {
    태양과의거리: 15 + 287,
    반지름: 2.5,
    자전속도: ((Math.PI * 2) / 17) * 5,
    공전속도: ((Math.PI * 2) / (30687 * 24)) * 500,
    자전방향: 1,
    공전방향: -1,
  },
  neptune: {
    태양과의거리: 15 + 457,
    반지름: 2.4,
    자전속도: ((Math.PI * 2) / 16) * 5,
    공전속도: ((Math.PI * 2) / (60190 * 24)) * 500,
    자전방향: -1,
    공전방향: -1,
  },
  moon: {
    지구와의거리: 2,
    반지름: 0.2,
    자전속도: ((Math.PI * 2) / (30 * 24)) * 5,
    공전속도: ((Math.PI * 2) / (30 * 24)) * 500,
    자전방향: -1,
    공전방향: -1,
  },
};
const clock = new THREE.Clock();

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

const canvas = document.getElementById("solarsystem");
const scene = new THREE.Scene();

// texture
const textureLoader = new THREE.TextureLoader();
textureLoader.load("./textures/8k_stars_milky_way.jpg", (environmentMap) => {
  environmentMap.mapping = THREE.EquirectangularReflectionMapping;
  scene.background = environmentMap;
  scene.environment = environmentMap;
  environmentMap.colorSpace = THREE.SRGBColorSpace;
});

const sunTexture = textureLoader.load("./textures/8k_sun.jpg");
sunTexture.colorSpace = THREE.SRGBColorSpace;

const mercuryTexture = textureLoader.load("./textures/8k_mercury.jpg");
mercuryTexture.colorSpace = THREE.SRGBColorSpace;

const venusTexture = textureLoader.load("./textures/8k_venus_surface.jpg");
venusTexture.colorSpace = THREE.SRGBColorSpace;

const earthDayTexture = textureLoader.load("./textures/8k_earth_daymap.jpg");
earthDayTexture.colorSpace = THREE.SRGBColorSpace;

const moonTexture = textureLoader.load("./textures/8k_moon.jpg");
moonTexture.colorSpace = THREE.SRGBColorSpace;

const marsTexture = textureLoader.load("./textures/8k_mars.jpg");
marsTexture.colorSpace = THREE.SRGBColorSpace;

const jupiterTexture = textureLoader.load("./textures/8k_jupiter.jpg");
jupiterTexture.colorSpace = THREE.SRGBColorSpace;

const saturnTexture = textureLoader.load("./textures/8k_saturn.jpg");
saturnTexture.colorSpace = THREE.SRGBColorSpace;

const saturnRingTexture = textureLoader.load("./textures/8k_saturn_ring_alpha.png");
saturnRingTexture.colorSpace = THREE.SRGBColorSpace;

const uranusTexture = textureLoader.load("./textures/2k_uranus.jpg");
uranusTexture.colorSpace = THREE.SRGBColorSpace;

const neptuneTexture = textureLoader.load("./textures/2k_neptune.jpg");
neptuneTexture.colorSpace = THREE.SRGBColorSpace;

// mesh
const sunMesh = new THREE.Mesh(
  new THREE.SphereGeometry(planet.sun.반지름, 64, 64),
  new THREE.MeshStandardMaterial({ map: sunTexture, lightMap: sunTexture, lightMapIntensity: 10 })
);
sunMesh.position.set(0, 0, 0);
scene.add(sunMesh);

const mercuryMesh = new THREE.Mesh(
  new THREE.SphereGeometry(planet.mercury.반지름, 64, 64),
  new THREE.MeshStandardMaterial({ map: mercuryTexture })
);
mercuryMesh.position.x = planet.mercury.태양과의거리;
scene.add(mercuryMesh);

const mercuryOrbit = new THREE.Line(
  new THREE.RingGeometry(planet.mercury.태양과의거리, planet.mercury.태양과의거리, 64),
  new THREE.LineBasicMaterial({ color: 0x1d1d1d })
);
mercuryOrbit.rotation.x = Math.PI / 2;
scene.add(mercuryOrbit);

const venusMesh = new THREE.Mesh(
  new THREE.SphereGeometry(planet.venus.반지름, 64, 64),
  new THREE.MeshStandardMaterial({ map: venusTexture })
);
venusMesh.position.x = planet.venus.태양과의거리;
scene.add(venusMesh);

const venusOrbit = new THREE.Line(
  new THREE.RingGeometry(planet.venus.태양과의거리, planet.venus.태양과의거리, 64),
  new THREE.LineBasicMaterial({ color: 0x1d1d1d })
);
venusOrbit.rotation.x = Math.PI / 2;
scene.add(venusOrbit);

const earthMesh = new THREE.Mesh(
  new THREE.SphereGeometry(planet.earth.반지름, 64, 64),
  new THREE.MeshStandardMaterial({
    map: earthDayTexture,
  })
);
earthMesh.position.x = planet.earth.태양과의거리;
earthMesh.position.z = planet.earth.태양과의거리;
scene.add(earthMesh);

const earthOrbit = new THREE.Line(
  new THREE.RingGeometry(planet.earth.태양과의거리, planet.earth.태양과의거리, 64),
  new THREE.LineBasicMaterial({ color: 0x1d1d1d })
);
earthOrbit.rotation.x = Math.PI / 2;
scene.add(earthOrbit);

const moonMesh = new THREE.Mesh(
  new THREE.SphereGeometry(planet.moon.반지름, 64, 64),
  new THREE.MeshStandardMaterial({ map: moonTexture })
);
moonMesh.position.x = earthMesh.position.x + planet.moon.지구와의거리;
moonMesh.position.z = earthMesh.position.z + planet.moon.지구와의거리;
scene.add(moonMesh);

const moonOrbit = new THREE.Line(
  new THREE.RingGeometry(planet.moon.지구와의거리, planet.moon.지구와의거리, 64),
  new THREE.LineBasicMaterial({ color: 0x1d1d1d })
);
moonOrbit.rotation.x = Math.PI / 2;
scene.add(moonOrbit);

const marsMesh = new THREE.Mesh(
  new THREE.SphereGeometry(planet.mars.반지름, 64, 64),
  new THREE.MeshStandardMaterial({ map: marsTexture })
);
marsMesh.position.x = planet.mars.태양과의거리;
scene.add(marsMesh);

const marsOrbit = new THREE.Line(
  new THREE.RingGeometry(planet.mars.태양과의거리, planet.mars.태양과의거리, 64),
  new THREE.LineBasicMaterial({ color: 0x1d1d1d })
);
marsOrbit.rotation.x = Math.PI / 2;
scene.add(marsOrbit);

const jupiterMesh = new THREE.Mesh(
  new THREE.SphereGeometry(planet.jupiter.반지름, 64, 64),
  new THREE.MeshStandardMaterial({ map: jupiterTexture })
);
jupiterMesh.position.x = planet.jupiter.태양과의거리;
scene.add(jupiterMesh);

const jupiterOrbit = new THREE.Line(
  new THREE.RingGeometry(planet.jupiter.태양과의거리, planet.jupiter.태양과의거리, 64),
  new THREE.LineBasicMaterial({ color: 0x1d1d1d })
);
jupiterOrbit.rotation.x = Math.PI / 2;
scene.add(jupiterOrbit);

const saturnMesh = new THREE.Mesh(
  new THREE.SphereGeometry(planet.saturn.반지름, 64, 64),
  new THREE.MeshStandardMaterial({ map: saturnTexture })
);
saturnMesh.position.x = planet.saturn.태양과의거리;
scene.add(saturnMesh);

const saturnRingGeometry = new THREE.RingGeometry(planet.saturn.반지름 + 5, planet.saturn.반지름 + 8, 64);
const v3 = new THREE.Vector3();
for (let i = 0; i < saturnRingGeometry.attributes.position.count; i++) {
  v3.fromBufferAttribute(saturnRingGeometry.attributes.position, i);
  saturnRingGeometry.attributes.uv.setXY(i, v3.length() < planet.saturn.반지름 + 6.5 ? 0 : 1, 1);
}

const saturnRingMesh = new THREE.Mesh(
  saturnRingGeometry,
  new THREE.MeshBasicMaterial({ map: saturnRingTexture, side: THREE.DoubleSide })
);

saturnRingMesh.rotation.x = Math.PI / 1.8;
saturnRingMesh.position.x = planet.saturn.태양과의거리;
scene.add(saturnRingMesh);

const saturnOrbit = new THREE.Line(
  new THREE.RingGeometry(planet.saturn.태양과의거리, planet.saturn.태양과의거리, 64),
  new THREE.LineBasicMaterial({ color: 0x1d1d1d })
);
saturnOrbit.rotation.x = Math.PI / 2;
scene.add(saturnOrbit);

const uranusMesh = new THREE.Mesh(
  new THREE.SphereGeometry(planet.uranus.반지름, 64, 64),
  new THREE.MeshStandardMaterial({ map: uranusTexture })
);
uranusMesh.position.x = planet.uranus.태양과의거리;
scene.add(uranusMesh);

const uranusOrbit = new THREE.Line(
  new THREE.RingGeometry(planet.uranus.태양과의거리, planet.uranus.태양과의거리, 64),
  new THREE.LineBasicMaterial({ color: 0x1d1d1d })
);
uranusOrbit.rotation.x = Math.PI / 2;
scene.add(uranusOrbit);

const neptuneMesh = new THREE.Mesh(
  new THREE.SphereGeometry(planet.neptune.반지름, 64, 64),
  new THREE.MeshStandardMaterial({ map: neptuneTexture })
);
neptuneMesh.position.x = planet.neptune.태양과의거리;
scene.add(neptuneMesh);

const neptuneOrbit = new THREE.Line(
  new THREE.RingGeometry(planet.neptune.태양과의거리, planet.neptune.태양과의거리, 64),
  new THREE.LineBasicMaterial({ color: 0x1d1d1d })
);
neptuneOrbit.rotation.x = Math.PI / 2;
scene.add(neptuneOrbit);

// light
const pointLight = new THREE.PointLight(0xffffff, 500, 10000, 1);

scene.add(pointLight);

// camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.001, 1000);

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

let isCameraMoving = false;
controls.addEventListener("start", () => {
  isCameraMoving = true;
});
controls.addEventListener("end", () => {
  isCameraMoving = false;
});

camera.position.y = initialCameraPosition.y;
scene.add(camera);

// renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

window.addEventListener("resize", () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1));
});

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  sunMesh.rotation.y = planet.sun.자전속도 * elapsedTime;

  mercuryMesh.rotation.y = planet.mercury.자전속도 * elapsedTime;
  mercuryMesh.position.x =
    Math.cos(planet.mercury.공전속도 * elapsedTime) * planet.mercury.태양과의거리 * planet.mercury.공전방향;
  mercuryMesh.position.z = Math.sin(planet.mercury.공전속도 * elapsedTime) * planet.mercury.태양과의거리;

  venusMesh.rotation.y = planet.venus.자전속도 * elapsedTime;
  venusMesh.position.x =
    Math.cos(planet.venus.공전속도 * elapsedTime) * planet.venus.태양과의거리 * planet.venus.공전방향;
  venusMesh.position.z = Math.sin(planet.venus.공전속도 * elapsedTime) * planet.venus.태양과의거리;

  earthMesh.rotation.y = planet.earth.자전속도 * elapsedTime;
  earthMesh.position.x =
    Math.cos(planet.earth.공전속도 * elapsedTime) * planet.earth.태양과의거리 * planet.earth.공전방향;
  earthMesh.position.z = Math.sin(planet.earth.공전속도 * elapsedTime) * planet.earth.태양과의거리;

  moonMesh.rotation.y = planet.moon.자전속도 * elapsedTime;
  moonMesh.position.x =
    Math.cos(planet.moon.공전속도 * elapsedTime) * planet.moon.지구와의거리 * planet.moon.공전방향 +
    earthMesh.position.x;
  moonMesh.position.z = Math.sin(planet.moon.공전속도 * elapsedTime) * planet.moon.지구와의거리 + earthMesh.position.z;

  moonOrbit.position.x = earthMesh.position.x;
  moonOrbit.position.z = earthMesh.position.z;

  marsMesh.rotation.y = planet.mars.자전속도 * elapsedTime;
  marsMesh.position.x = Math.cos(planet.mars.공전속도 * elapsedTime) * planet.mars.태양과의거리 * planet.mars.공전방향;
  marsMesh.position.z = Math.sin(planet.mars.공전속도 * elapsedTime) * planet.mars.태양과의거리;

  jupiterMesh.rotation.y = planet.jupiter.자전속도 * elapsedTime;
  jupiterMesh.position.x =
    Math.cos(planet.jupiter.공전속도 * elapsedTime) * planet.jupiter.태양과의거리 * planet.jupiter.공전방향;
  jupiterMesh.position.z = Math.sin(planet.jupiter.공전속도 * elapsedTime) * planet.jupiter.태양과의거리;

  saturnMesh.rotation.y = planet.saturn.자전속도 * elapsedTime;
  saturnMesh.position.x =
    Math.cos(planet.saturn.공전속도 * elapsedTime) * planet.saturn.태양과의거리 * planet.saturn.공전방향;
  saturnMesh.position.z = Math.sin(planet.saturn.공전속도 * elapsedTime) * planet.saturn.태양과의거리;

  saturnRingMesh.position.x = saturnMesh.position.x;
  saturnRingMesh.position.z = saturnMesh.position.z;

  uranusMesh.rotation.y = planet.uranus.자전속도 * elapsedTime;
  uranusMesh.position.x =
    Math.cos(planet.uranus.공전속도 * elapsedTime) * planet.uranus.태양과의거리 * planet.uranus.공전방향;
  uranusMesh.position.z = Math.sin(planet.uranus.공전속도 * elapsedTime) * planet.uranus.태양과의거리;

  neptuneMesh.rotation.y = planet.neptune.자전속도 * elapsedTime;
  neptuneMesh.position.x =
    Math.cos(planet.neptune.공전속도 * elapsedTime) * planet.neptune.태양과의거리 * planet.neptune.공전방향;
  neptuneMesh.position.z = Math.sin(planet.neptune.공전속도 * elapsedTime) * planet.neptune.태양과의거리;

  if (cameraTarget.planet) {
    camera.position.lerp(
      new THREE.Vector3(
        cameraTarget.position.x,
        cameraTarget.position.y + cameraTarget.planet.반지름 * 3,
        cameraTarget.position.z
      ),
      0.05
    );

    controls.target = cameraTarget.position;
  }

  controls.update();

  renderer.render(scene, camera);

  window.requestAnimationFrame(tick);
};

tick();

const gui = new GUI();

const cameraObject = {
  sun: () => {
    cameraTarget.position = sunMesh.position;
    cameraTarget.planet = planet.sun;
  },
  mercury: () => {
    cameraTarget.position = mercuryMesh.position;
    cameraTarget.planet = planet.mercury;
  },
  venus: () => {
    cameraTarget.position = venusMesh.position;
    cameraTarget.planet = planet.venus;
  },
  earth: () => {
    cameraTarget.position = earthMesh.position;
    cameraTarget.planet = planet.earth;
  },
  moon: () => {
    cameraTarget.position = moonMesh.position;
    cameraTarget.planet = planet.moon;
  },
  mars: () => {
    cameraTarget.position = marsMesh.position;
    cameraTarget.planet = planet.mars;
  },
  jupiter: () => {
    cameraTarget.position = jupiterMesh.position;
    cameraTarget.planet = planet.jupiter;
  },
  saturn: () => {
    cameraTarget.position = saturnMesh.position;
    cameraTarget.planet = planet.saturn;
  },
  uranus: () => {
    cameraTarget.position = uranusMesh.position;
    cameraTarget.planet = planet.uranus;
  },
  neptune: () => {
    cameraTarget.position = neptuneMesh.position;
    cameraTarget.planet = planet.neptune;
  },
  cancel: () => {
    cameraTarget.planet = null;
    cameraTarget.position = new THREE.Vector3(0, 0, 0);
    camera.position.set(initialCameraPosition.x, initialCameraPosition.y, initialCameraPosition.z);
    controls.target = cameraTarget.position;
  },
};

gui.add(cameraObject, "sun").name("태양");
gui.add(cameraObject, "mercury").name("수성");
gui.add(cameraObject, "venus").name("금성");
gui.add(cameraObject, "earth").name("지구");
gui.add(cameraObject, "moon").name("달");
gui.add(cameraObject, "mars").name("화성");
gui.add(cameraObject, "jupiter").name("목성");
gui.add(cameraObject, "saturn").name("토성");
gui.add(cameraObject, "uranus").name("천왕성");
gui.add(cameraObject, "neptune").name("해왕성");
gui.add(cameraObject, "cancel").name("취소");
