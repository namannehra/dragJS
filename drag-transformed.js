'use strict';

(function () {
	'use strict';

	if ('getDragEvent' in window) return;
	var des = 'dragEventProperties',
	    sym = 'Symbol' in window ? Symbol(des) : '_' + des,
	    pointers = {};
	var hasEvents = false,
	    activePointers = 0;
	var check = function check(e, f) {
		if (!e || e.nodeType !== 1) throw new TypeError('Failed to execute \'' + f + '\' with \'' + e + '\': parameter 1 should be a node with nodeType equal to 1');
	};
	var dispatch = function dispatch(e, pointer, state) {
		pointer.target.dispatchEvent(new CustomEvent('drag', {
			detail: {
				state: state,
				startX: pointer.startX,
				startY: pointer.startY,
				dx: e.clientX - pointer.startX,
				dy: e.clientY - pointer.startY,
				sourceEvent: e
			}
		}));
	};
	var pointerdown = function pointerdown(e) {
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
		}
	};
	var pointermove = function pointermove(e) {
		var pointer = pointers[e.pointerId];
		if (pointer === undefined) return;
		if (pointer.target[sym] === undefined) {
			delete pointers[e.pointerId];
			return;
		}
		var start = pointer.start;
		if (start) pointer.start = false;
		dispatch(e, pointer, start ? 'start' : 'drag');
	};
	var pointerup = function pointerup(e) {
		var pointer = pointers[e.pointerId];
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
	window.getDragEvent = function (e) {
		check(e, 'getDragEvent');
		if (sym in e) return;
		e[sym] = true;
		e.addEventListener('pointerdown', pointerdown);
	};
	window.stopDragEvent = function (e) {
		check(e, 'stopDragEvent');
		delete e[sym];
		e.removeEventListener('pointerdown', pointerdown);
	};
	window.firesDragEvent = function (e) {
		check(e, 'firesDragEvent');
		return sym in e;
	};
})();