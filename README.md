# shrink-path

Utility to shrink file paths to a given length.

## Usage

```js
const { shrinkPath } = require('shrink-path');
// or
import { shrinkPath } from 'shrink-path';
// or
import shrinkPath from 'shrink-path';

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

## Docs

The algorithm:
1. Tries to **shrink path segments**, skipping some letters.  
    `aaaaaaaaaa/bbbbbbbbbb/cccccc.ddd`  
    becomes  
    `aaa…aaa/bbb…bbb/ccc…ddd`  
2. When still too long, tries to **omit entire segments** from the middle.  
    `aaa…aaa/bbb…bbb/ccc…ddd`  
    becomes  
    `aaa…aaa/…/ccc…ddd`  
3. Omitting entire segments can result in shorter path than the desired maximum, in this case we unshrink previously shrinked segments to the maximum available size.  
    `aaa…aaa/…/ccc…ddd`  
    becomes  
    `aaaa…aaaa/…/cccc….ddd`  

```js
shrinkPath(
  path: string,
  maxLength: number,
  minSegmentLength: number = maxLength / 3,
  ellipsisPlacement: 'middle' | 'end' = 'middle',
  ellipsis: string = '…'
): string;
```

- The result length will always be shorter or equal to `maxLength`. If possible, the algorithm will try not to shrink more than needed.
- Path segments shrinking can be configured by `minSegmentLength`, this value sets the minimum length a path segment must have. Defaults to `maxLength / 3`. Set to `Infinity` to disable segment shrinking.
- Segments removed entirely only if each segment length reached `minSegmentLength` and no further shrinking is possible.
- `ellipsisPlacement` controls how path segments are shortened. Set it to `end` to place ellipsis at the path segment end: instead of `aaaa…aaaa/…/cccc….ddd` it will produce `aaaaaaaa…/…/cccccc.d…`.
- By default `…` is used to mark shrinked parts of the path, configurable by the `ellipis` argument.
- Windows paths are always normalized to Unix style.
