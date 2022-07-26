/**
 * Shrink a string omitting the middle part.
 *
 * @param {string} text
 * @param {number} length
 * @param {string} ellipsis
 */
const shrinkMiddle = (text: string, length: number, ellipsis: string) => {
	if (text.length <= length) return text;
	const keep_2 = Math.ceil((length - ellipsis.length) / 2);
	return text.substring(0, keep_2) + ellipsis + text.substring(keep_2 + text.length - length + ellipsis.length);
};

/**
 * Shrink a string omitting the end part.
 *
 * @param {string} text
 * @param {number} length
 * @param {string} ellipsis
 */
const shrinkEnd = (text: string, length: number, ellipsis: string) => {
	if (text.length <= length) return text;
	return text.substring(0, length - ellipsis.length) + ellipsis;
};

/**
 * @param {string} path Full path to shrink.
 * @param {number} maxLength Upper limit of the result length.
 * @param {number} minSegmentLength Minimum length of a path segment. Set to Infinity to disable segment shrinking.
 * @param {'middle'|'end'} ellipsisPlacement Defines where should the ellipsis occur in shrinked segments.
 * @param {string} ellipsis Replacement string to mark shrinked parts of the path.
 * @returns {string} Shrinked path.
 */
export const shrinkPath = (
	path: string,
	maxLength: number,
	minSegmentLength: number = maxLength / 3,
	ellipsisPlacement: 'middle' | 'end' = 'middle',
	ellipsis: string = '…'
) => {
	if (path.length <= maxLength) {
		return path.replace(/\\/g, '/');
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
	if (Number.isFinite(minSegmentLength)) {
		minSegmentLength = Math.floor(minSegmentLength);
		const shrinkedLength = (minSL: number) => segments.reduce((acc, curr) => acc + Math.min(curr.length, minSL), segments.length - 1);

		do {
			const minShrinkedLength = shrinkedLength(minSegmentLength);
			if (minShrinkedLength <= maxLength) {

				// find min shrink value where result still fits into maxLength size
				let min = minSegmentLength;
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

				// collect segment positions which can be shrinked
				const positions = [];
				for (const [i, segment] of segments.entries()) {
					if (segment.length > min) {
						positions.push({ index: i, size: min });
					}
				}

				// we still may have some empty space to reach maxLength
				// try to increment each segment incrementally
				if (positions.length > 0) {
					const underflow = maxLength - shrinkedLength(min);
					for (let i = 0; i < underflow; i++) {
						positions[i % positions.length].size++;
					}
				}

				// resize segments
				const shrink = ellipsisPlacement === 'end' ? shrinkEnd : shrinkMiddle;
				for (const pos of positions) {
					segments[pos.index] = shrink(segments[pos.index], pos.size, ellipsis);
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

	return shrinkEnd(segments.join('/'), maxLength, ellipsis);
};

export default shrinkPath;
