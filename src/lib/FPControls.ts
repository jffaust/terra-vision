import {
    MathUtils,
    Spherical,
    Vector3,
    Camera
} from 'three';

// Inspired by https://github.com/mrdoob/three.js/blob/5da9a7045dfe4a3ee6d5db431ba4bce69c811749/examples/jsm/controls/FirstPersonControls.js

export class FPControls {
    object: Camera;
    domElement: HTMLElement | undefined;

    movementSpeed: number;
    lookSpeed: number;
    mouseDragOn: boolean;

    private lat = 0;
    private lon = 0;

    private _lookDirection = new Vector3();
    private _spherical = new Spherical();
    private _target = new Vector3();

    private lastPointerX = 0;
    private lastPointerY = 0;

    private _onPointerMove: (e: PointerEvent) => void;
    private _onPointerDown: (e: PointerEvent) => void;
    private _onPointerUp: (e: PointerEvent) => void;

    constructor(object: Camera, domElement?: HTMLElement) {
        this.object = object;
        this.domElement = domElement;

        this.movementSpeed = 1.0;
        this.lookSpeed = 0.05;
        this.mouseDragOn = false;

        this._onPointerDown = this.onPointerDown.bind(this)
        this._onPointerUp = this.onPointerUp.bind(this);
        this._onPointerMove = this.onPointerMove.bind(this);

        this.domElement?.addEventListener('pointerdown', this._onPointerDown);
        this.domElement?.addEventListener('pointermove', this._onPointerMove);
        this.domElement?.addEventListener('pointerup', this._onPointerUp);

        this.setOrientation();
    }

    dispose() {
        this.domElement?.removeEventListener('pointerdown', this._onPointerDown);
        this.domElement?.removeEventListener('pointermove', this._onPointerMove);
        this.domElement?.removeEventListener('pointerup', this._onPointerUp);
    }

    onPointerDown(e: PointerEvent) {
        console.log("KLFJDLKJFDLKFJDLK")
        this.mouseDragOn = true;
        this.lastPointerX = e.pageX;
        this.lastPointerY = e.pageY;
    }

    onPointerUp(e: PointerEvent) {
        this.mouseDragOn = false;
    }

    onPointerMove(e: PointerEvent) {
        if (this.mouseDragOn) {
            const diffX = e.pageX - this.lastPointerX;
            const diffY = e.pageY - this.lastPointerY;

            this.rotateCamera(diffX, diffY);

            this.lastPointerX = e.pageX;
            this.lastPointerY = e.pageY;
        }
    }

    rotateCamera(dx: number, dy: number) {
        const targetPosition = new Vector3();

        this.lon += dx * this.lookSpeed;
        this.lat += dy * this.lookSpeed;

        this.lat = Math.max(- 85, Math.min(85, this.lat));

        let phi = MathUtils.degToRad(90 - this.lat);
        const theta = MathUtils.degToRad(this.lon);

        const position = this.object.position;

        targetPosition.setFromSphericalCoords(1, phi, theta).add(position);

        this.object.lookAt(targetPosition);
    }

    setOrientation() {

        const quaternion = this.object.quaternion;

        this._lookDirection.set(0, 0, - 1).applyQuaternion(quaternion);
        this._spherical.setFromVector3(this._lookDirection);

        this.lat = 90 - MathUtils.radToDeg(this._spherical.phi);
        this.lon = MathUtils.radToDeg(this._spherical.theta);

    }
}