declare function shrinkPath(
	path: string,
	maxLength: number,
	minSegmentLength: number = maxLength / 3,
	ellipsisPlacement: 'middle' | 'end' = 'middle',
	ellipsis: string = '…'
): string;

export = shrinkPath;
