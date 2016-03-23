(() => {
	'use strict';
	if ('PointerDragEvent' in window) return;
	const prop = '_PointerDragEventProperties',
				pointers = {};
	let hasEvents = false,
			activePointers = 0;
	const check = (e, f) => {
		if (!e || e.nodeType !== 1) throw new TypeError(`Failed to execute '${f}': The callback provided as parameter 1 is not a node with nodeType 1`);
	};
	const dispatch = (e, pointer, state) => {
		pointer.target.dispatchEvent(new CustomEvent('drag', {
			detail: {
				state,
				startX: pointer.startX,
				startY: pointer.startY,
				dx: e.clientX - pointer.startX,
				dy: e.clientY - pointer.startY,
				sourceEvent: e
			}
		}));
	};
	const pointerdown = function(e) {
		pointers[e.pointerId] = {
			start: true,
			startX: e.clientX,
			startY: e.clientY,
			target: this
		};
		activePointers++;
		if (!hasEvents && activePointers > 0) {
			hasEvents = true;
			document.addEventListener('pointermove', pointermove);
			document.addEventListener('pointerup', pointerup);
			document.addEventListener('pointercancel', pointerup);
		}
	};
	const pointermove = e => {
		const pointer = pointers[e.pointerId];
		if (pointer === undefined) return;
		if (pointer.target[prop] === undefined) {
			delete pointers[e.pointerId];
			return;
		}
		const start = pointer.start;
		if (start) pointer.start = false;
		dispatch(e, pointer, start ? 'start' : 'drag');
	};
	const pointerup = e => {
		const pointer = pointers[e.pointerId];
		if (pointer === undefined) return;
		delete pointers[e.pointerId];
		activePointers--;
		if (hasEvents && activePointers === 0) {
			hasEvents = false;
			document.removeEventListener('pointermove', pointermove);
			document.removeEventListener('pointerup', pointerup);
		}
		if (!pointer.start) dispatch(e, pointer, 'end');
	};
	window.PointerDragEvent = {
		start(e) {
			check(e, 'start');
			if (prop in e) return;
			e[prop] = true;
			e.addEventListener('pointerdown', pointerdown);
		},
		stop(e) {
			check(e, 'stop');
			delete e[prop];
			e.removeEventListener('pointerdown', pointerdown);
		},
		fires(e) {
			check(e, 'fires');
			return prop in e;
		}
	};
})();