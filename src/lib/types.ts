import type { Euler, Vector3 } from "three";

export type Body = {
	id: string;
	name: string;
	mounted: number;
	position: Vector3;
	rotation: Euler;
	color: string;
	controllable?: boolean;
	status?: "active" | "fallen";
	isBot?: boolean;
};
