declare function shrinkPath(path: string, maxLength: number, softSegmentLength: number = maxLength / 3, ellipsis: string = '…'): string;

export = shrinkPath;
