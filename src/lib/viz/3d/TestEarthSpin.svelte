<script lang="ts">
	import * as THREE from 'three';
	import {
		OrbitControls,
		PerspectiveCamera,
		useThrelte,
		AmbientLight,
		Line,
		Group,
		Mesh
	} from '@threlte/core';
	import { onDestroy, onMount } from 'svelte';
	import Earth from '$lib/graphics/3d/Earth.svelte';
	import { EARTH_RADIUS, spaceSim } from '$lib/sim/threejs';
	import { DEG2RAD } from 'three/src/math/MathUtils';
	import * as ae from 'astronomy-engine';

	let earthRot = getNorthPoleEulerRotation($spaceSim.earth.north);

	const { scene } = useThrelte();
	let camera: THREE.PerspectiveCamera;

	const eqdRot = earthRot.clone();
	eqdRot.x += 90 * DEG2RAD;
	const eqdPlane = new THREE.CircleGeometry(6, 72);
	const eqdMat = new THREE.MeshBasicMaterial({
		color: 0xffff00,
		side: THREE.DoubleSide,
		transparent: false,
		opacity: 0.5
	});

	onMount(async () => {
		scene.add(new THREE.AxesHelper(100));

		if (camera) {
			camera.position.x = EARTH_RADIUS * 2;
			camera.position.y = EARTH_RADIUS * 2;
			camera.position.z = EARTH_RADIUS * 2;
		}
	});

	const j2000axis = ae.RotationAxis(ae.Body.Earth, 0);
	const eclAxis = ae.Ecliptic(j2000axis.north).vec;
	const fixedJ2000North = new THREE.Vector3(eclAxis.x, eclAxis.z, -eclAxis.y);
	const eqjRot = getNorthPoleEulerRotation(fixedJ2000North);
	eqjRot.x += 90 * DEG2RAD;

	const eqjPlane = new THREE.CircleGeometry(8, 72);
	const eqjMat = new THREE.MeshBasicMaterial({
		color: 0xff0000,
		side: THREE.DoubleSide,
		transparent: false,
		opacity: 0.5
	});

	function getNorthPoleEulerRotation(vec: THREE.Vector3): THREE.Euler {
		let euler = new THREE.Euler(0, 0, 0, 'XZY');
		euler.x = Math.atan(vec.z / vec.y);
		// Apply the inverse rotation so we can get the right Y-value to use
		// in the second rotation
		const invRotatedNorth = vec.clone();
		invRotatedNorth.applyEuler(new THREE.Euler(-euler.x));
		euler.z = -Math.atan(vec.x / invRotatedNorth.y); // x value doesn't change
		return euler;
	}
</script>

<PerspectiveCamera bind:camera far={100}>
	<OrbitControls target={{ x: 0, y: 0, z: 0 }} />
</PerspectiveCamera>

<AmbientLight />

<Earth rotation={earthRot} />

<Mesh geometry={eqdPlane} material={eqdMat} rotation={eqdRot} />

<Mesh geometry={eqjPlane} material={eqjMat} rotation={eqjRot} />

<style>
</style>
