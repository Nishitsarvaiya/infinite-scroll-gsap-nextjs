"use client";
import { useEffect, useRef } from "react";
import styles from "./page.module.css";
import gsap from "gsap";

const songs = [
	"Gold",
	"We know Who We Are",
	"Go on Then, Love",
	"Spider",
	"Move with Purpose",
	"Emotion Sickness",
	"Bittersweet Melody",
	"Treading Water",
	"Walk Me Home",
	"Blue Eternal",
];

const lerp = (a, b, n) => (1 - n) * a + n * b;

const isDesktop = () => !/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

export default function Home() {
	const items = useRef([]);
	const wrapper = useRef();
	const list = useRef();
	const listHeight = useRef(0);
	const itemHeight = useRef(0);
	const scrollerHeight = useRef(0);
	const scrollObj = useRef({ current: 0, target: 0, speed: 0 });
	const translate = useRef(0);
	const raf = useRef(null);
	const touchStart = useRef(0);
	const touchY = useRef(0);
	const isDragging = useRef(false);

	const dispose = (scroll) => {
		gsap.set(items.current, {
			y: (i) => {
				return i * itemHeight.current + scroll;
			},
			modifiers: {
				y: (y) => {
					const s = gsap.utils.wrap(-itemHeight.current, scrollerHeight.current - itemHeight.current, parseFloat(y));
					return `${s}px`;
				},
			},
		});
	};

	const onWheel = (e) => {
		scrollObj.current.target -= e.deltaY;
	};

	const onResize = () => {
		listHeight.current = list.current.clientHeight;
		itemHeight.current = isDesktop() ? 0.2 * window.innerHeight : (1 / 7) * window.innerHeight;
		scrollerHeight.current = items.current.length * itemHeight.current;
	};

	const update = () => {
		raf.current = requestAnimationFrame(update);
		translate.current = lerp(translate.current, scrollObj.current.target, 0.04);
		dispose(translate.current);

		scrollObj.current.speed = translate.current - scrollObj.current.current;
		scrollObj.current.current = translate.current;

		gsap.to(items.current, {
			scaleX: 1 - Math.min(100, Math.abs(scrollObj.current.speed)) * 0.005,
			skewX: scrollObj.current.speed * 0.8,
		});
	};

	const onTouchStart = (e) => {
		touchStart.current = e.clientY || e.touches[0].clientY;
		isDragging.current = true;
	};

	const onTouchMove = (e) => {
		if (!isDragging.current) return;
		touchY.current = e.clientY || e.touches[0].clientY;
		scrollObj.current.target += (touchY.current - touchStart.current) * 2.5;
		touchStart.current = touchY.current;
	};

	const onTouchEnd = () => {
		isDragging.current = false;
	};

	const addEventListeners = () => {
		wrapper.current.addEventListener("wheel", onWheel);
		wrapper.current.addEventListener("mousewheel", onWheel);
		wrapper.current.addEventListener("touchstart", onTouchStart);
		wrapper.current.addEventListener("touchmove", onTouchMove);
		wrapper.current.addEventListener("touchend", onTouchEnd);
		wrapper.current.addEventListener("mousedown", onTouchStart);
		wrapper.current.addEventListener("mousemove", onTouchMove);
		wrapper.current.addEventListener("mouseleave", onTouchEnd);
		wrapper.current.addEventListener("mouseup", onTouchEnd);
	};

	const removeEventListeners = () => {
		wrapper.current.removeEventListener("wheel", onWheel);
		wrapper.current.removeEventListener("mousewheel", onWheel);
		wrapper.current.removeEventListener("touchstart", onTouchStart);
		wrapper.current.removeEventListener("touchmove", onTouchMove);
		wrapper.current.removeEventListener("touchend", onTouchEnd);
		wrapper.current.removeEventListener("mousedown", onTouchStart);
		wrapper.current.removeEventListener("mousemove", onTouchMove);
		wrapper.current.removeEventListener("mouseleave", onTouchEnd);
		wrapper.current.removeEventListener("mouseup", onTouchEnd);
	};

	useEffect(() => {
		onResize();
		dispose(0);
		update();
		addEventListeners();

		return () => {
			removeEventListeners();
		};
	}, []);

	return (
		<main className={styles.main}>
			<div className={styles["scroll-list-wrapper"]} ref={wrapper}>
				<ul className={styles["scroll-list"]} ref={list}>
					{songs.map((song, idx) => (
						<li className={styles["scroll-list-item"]} key={idx} ref={(ref) => (items.current[idx] = ref)}>
							{song}
						</li>
					))}
				</ul>
			</div>
		</main>
	);
}
