import { useEffect, useRef } from "react";
import styles from "./CustomCursor.module.css";

function CustomCursor() {
  const ringRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ringEl = ringRef.current;
    const dotEl = dotRef.current;
    if (!ringEl || !dotEl) return;

    const ringNode: HTMLDivElement = ringEl;
    const dotNode: HTMLDivElement = dotEl;

    const mobile = window.matchMedia(
      "(max-width: 900px), (hover: none), (pointer: coarse)"
    );
    if (mobile.matches) return;

    const mouse = { x: 0, y: 0 };
    const ringPos = { x: 0, y: 0 };
    const dotPos = { x: 0, y: 0 };
    let started = false;
    let pickerOpen = false;
    let raf = 0;

    function hideForPicker() {
      pickerOpen = true;
      ringNode.classList.remove(styles.visible);
      dotNode.classList.remove(styles.visible);
      document.documentElement.classList.add("native-pointer");
    }

    function showAfterPicker() {
      pickerOpen = false;
      document.documentElement.classList.remove("native-pointer");
      if (started) {
        ringNode.classList.add(styles.visible);
        dotNode.classList.add(styles.visible);
      }
    }

    function isDateInput(el: EventTarget | null) {
      return el instanceof HTMLInputElement && el.type === "date";
    }

    function onMove(e: MouseEvent) {
      mouse.x = e.clientX;
      mouse.y = e.clientY;

      if (pickerOpen) return;

      if (!started) {
        started = true;
        ringPos.x = mouse.x;
        ringPos.y = mouse.y;
        dotPos.x = mouse.x;
        dotPos.y = mouse.y;
        ringNode.classList.add(styles.visible);
        dotNode.classList.add(styles.visible);
      }

      const target = e.target as HTMLElement | null;
      const hover = Boolean(
        target?.closest("a, button, select, input, label, [data-option]")
      );
      ringNode.dataset.variant = hover ? "hover" : "default";
    }

    function onPointerDown(e: PointerEvent) {
      if (isDateInput(e.target)) hideForPicker();
    }

    function onFocusOut(e: FocusEvent) {
      if (isDateInput(e.target)) showAfterPicker();
    }

    function onChange(e: Event) {
      if (isDateInput(e.target)) showAfterPicker();
    }

    function loop() {
      ringPos.x += (mouse.x - ringPos.x) * 0.14;
      ringPos.y += (mouse.y - ringPos.y) * 0.14;
      dotPos.x += (mouse.x - dotPos.x) * 0.38;
      dotPos.y += (mouse.y - dotPos.y) * 0.38;

      ringNode.style.transform = `translate(${ringPos.x}px, ${ringPos.y}px) translate(-50%, -50%)`;
      dotNode.style.transform = `translate(${dotPos.x}px, ${dotPos.y}px) translate(-50%, -50%)`;
      raf = requestAnimationFrame(loop);
    }

    window.addEventListener("mousemove", onMove, true);
    window.addEventListener("pointerdown", onPointerDown, true);
    window.addEventListener("focusout", onFocusOut, true);
    window.addEventListener("change", onChange, true);
    raf = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("mousemove", onMove, true);
      window.removeEventListener("pointerdown", onPointerDown, true);
      window.removeEventListener("focusout", onFocusOut, true);
      window.removeEventListener("change", onChange, true);
      document.documentElement.classList.remove("native-pointer");
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <div ref={ringRef} className={styles.ring} data-variant="default" />
      <div ref={dotRef} className={styles.dot} />
    </>
  );
}

export default CustomCursor;
