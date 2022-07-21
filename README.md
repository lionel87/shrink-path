# shrink-path

Utility to shrink file paths to a given length.

The algorithm:
1. Tries to shrink path segments, skipping letters from the middle.  
    input: `aaaaaaaaaa/bbbbbbbbbb/cccccc.ddd`  
    output: `aaa…aaa/bbb…bbb/ccc…ddd`  
2. When still too long, tries to omit segments from the middle.  
    input: `aaa…aaa/bbb…bbb/ccc…ddd`  
    output: `aaa…aaa/…/ccc…ddd`  
3. When shrinked path is shorter than the desired maximum, we unshrink it to the maximum available size.  
    input: `aaa…aaa/…/ccc…ddd`  
    output: `aaaa…aaaa/…/cccc….ddd`  

## Docs

```js
shrinkPath(
  path: string,
  maxLength: number,
  minSegmentLength: number = maxLength / 3,
  ellipsisPlacement: 'middle' | 'end' = 'middle',
  ellipsis: string = '…'
): string;
```

- The result will always be shorter or equal length to `maxLength`.
- By default `…` is used to mark shrinked parts of the path, configurable by the `ellipis` argument.
- Path segments shrinking can be configured by `minSegmentLength`, this value sets the minimum length a path segment must have. Defaults to `maxLength / 3`. Set to `Infinity` to disable segment shrinking.
- The algorithm will try to expand shrinked segments to produce result with equal length to `maxLength`.
- `ellipsisPlacement` controls how path segments are shortened. Set it to `end` to place ellipsis at the path segment end: instead of `aaaa…aaaa/…/cccc….ddd` it will produce `aaaaaaaa…/…/cccccc.d…`
- Windows paths are always normalized to Unix style.

## Usage

```js
const shrinkPath = require('shrink-path');

const filePath = 'c:\\Windows\\System32\\WindowsPowerShell\\v1.0\\Modules\\TroubleshootingPack\\en-US\\Microsoft.Windows.Diagnosis.TroubleshootingPack.dll-Help.xml';

shrinkPath(filePath, 60);
// c:/Windows/…/TroubleshootingPack/en-US/Microsoft.…l-Help.xml

shrinkPath(filePath, 60, 0);
// c:/Windows/Sys…m32/Win…ell/v1.0/Modules/Tro…ack/en-US/Mic…ml

shrinkPath(filePath, 60, 0, 'end');
// c:/Windows/System…/Window…/v1.0/Modules/Troubl…/en-US/Micro…

shrinkPath(filePath, 60, Infinity);
// …/Microsoft.Windows.Diagnosis.TroubleshootingPack.dll-Help.…
```
