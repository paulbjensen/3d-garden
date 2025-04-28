import { Euler, Vector3 } from "three";
export const getId = () => {
	return Math.random().toString(16).slice(2);
};
export const getRandomPosition = () => {
	return new Vector3(
		0.5 - Math.random() * 1,
		5 - Math.random() * 1 + 10,
		0.5 - Math.random() * 1,
	);
};
export const getRandomRotation = () => {
	return new Euler(Math.random() * 10, Math.random() * 10, Math.random() * 10);
};

export const getRandomColor = () => {
	return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
};
