<script lang="ts">
	import * as THREE from 'three';
	import { Group, Mesh, Line, LineSegments, type Position, type Rotation } from '@threlte/core';
	import { getContext } from 'svelte';
	import { Textures, CTX_TEXTURES } from '$lib/types';
	import Ring from './Ring.svelte';
	import { EARTH_RADIUS } from '$lib/sim/threejs';
	import { DEG2RAD } from 'three/src/math/MathUtils';

	export let showEquator = true;
	export let showRotationAxis = true;
	export let showPrimeMeridian = true;
	export let position: Position = new THREE.Vector3();
	export let rotation: Rotation = new THREE.Euler(0, 0, 0, 'XZY');

	const textures = getContext<Map<Textures, THREE.Texture>>(CTX_TEXTURES);

	const earthGeom = new THREE.SphereGeometry(EARTH_RADIUS, 100, 100);
	const earthMat = new THREE.MeshPhongMaterial({
		map: textures.get(Textures.EarthColor),
		// normalMap: earthNormalTexture,
		// normalScale: 0.5,
		// bumpMap: earthBumpMap,
		// bumpScale: 0.1,
		specularMap: textures.get(Textures.EarthSpecular),
		shininess: 0.5
	});
	const earthPolesPoints: THREE.Vector3Tuple[] = [
		[0, -EARTH_RADIUS * 1.1, 0],
		[0, EARTH_RADIUS * 1.1, 0]
	];

	const redLine = new THREE.LineBasicMaterial({ color: 'purple' });
</script>

<Group {position} {rotation}>
	<!-- earth -->
	<Mesh geometry={earthGeom} material={earthMat} />

	{#if showRotationAxis}
		<!-- rotation axis (geographic north and south poles) -->
		<Line points={earthPolesPoints} material={redLine} />
	{/if}

	{#if showEquator}
		<Ring radius={EARTH_RADIUS * 1.001} rotation={{ x: Math.PI / 2 }} color={'red'} />
	{/if}

	{#if showPrimeMeridian}
		<!-- prime meridian TODO: should be half a ring-->
		<!-- <LineSegments geometry={edgesCircleGeom} material={redLine} /> -->
		<Ring
			radius={EARTH_RADIUS * 1.001}
			color={'red'}
			thetaStart={0}
			thetaEnd={Math.PI}
			rotation={{ z: -90 * DEG2RAD }}
		/>
	{/if}

	<slot />
</Group>
