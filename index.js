/**
 * @param {string} segment
 * @param {number} length
 * @param {string} ellipsis
 */
const shrinkSegment = (segment, length, ellipsis) => {
	if (segment.length <= length) return segment;
	const keep_2 = Math.ceil((length - ellipsis.length) / 2);
	return segment.substring(0, keep_2) + ellipsis + segment.substring(keep_2 + segment.length - length + ellipsis.length);
};

/**
 * @param {string} path Full path to shrink.
 * @param {number} maxLength Upper limit of the result length.
 * @param {number} minSemgmentLength Minimum length of a path segment. Set to Infinity to disable segment shrinking.
 * @param {string} ellipsis Replacement string to mark shrinked parts of the path.
 * @returns {string} Shrinked path.
 */
const shrinkPath = (path, maxLength, minSemgmentLength = maxLength / 3, ellipsis = '…') => {
	if (path.length <= maxLength) {
		return path;
	}

	const segments = path.split(/\/|\\/);
	const stripPathSegment = () => {
		const mid = Math.ceil(segments.length / 2) - 1;
		if (segments[mid] === ellipsis) {
			segments.splice(mid, 1);
		}
		segments.splice(Math.ceil(segments.length / 2) - 1, 1, ellipsis);
	};

	// test if path is good enough with segment shrinking
	if (Number.isFinite(minSemgmentLength)) {
		minSemgmentLength = Math.floor(minSemgmentLength);
		const shrinkedLength = (minSL) => segments.reduce((acc, curr) => acc + Math.min(curr.length, minSL), segments.length - 1);

		do {
			const minShrinkedLength = shrinkedLength(minSemgmentLength);
			if (minShrinkedLength <= maxLength) {

				// find min shrink value where result still fits into maxLength size
				let min = minSemgmentLength;
				let max = maxLength;
				let mid;
				do {
					mid = Math.ceil(min + (max - min) / 2);
					if (shrinkedLength(mid) <= maxLength) {
						min = mid;
					} else {
						max = mid - 1;
					}
				} while (min < max);

				// we still may have some empty space to reach maxLength
				// try to increment each segment incrementally
				const positions = [];
				for (const [i, segment] of segments.entries()) {
					if (segment.length > min) {
						positions.push({ index: i, size: min });
					}
				}
				const underflow = maxLength - shrinkedLength(min);
				for (let i = 0; i < underflow; i++) {
					positions[i].size++;
				}

				// resize segments
				for (const pos of positions) {
					segments[pos.index] = shrinkSegment(segments[pos.index], pos.size, ellipsis);
				}

				return segments.join('/');
			}

			// skip a path segment
			stripPathSegment();
		} while (segments.length > 2);
	} else {
		while (
			segments.length > 2 &&
			maxLength < segments.reduce((acc, curr) => acc + curr.length, segments.length - 1)
		) {
			stripPathSegment();
		}
	}

	const result = segments.join('/');

	if (result.length > maxLength) {
		return result.substring(0, maxLength - ellipsis.length) + ellipsis;
	}

	return result;
};

module.exports = shrinkPath;
