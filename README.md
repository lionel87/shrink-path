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

`shrinkPath(path: string, maxLength: number; minSemgmentLength: number = maxLength / 3, ellipsis: string = '…'): string;`

- The result will always be shorter or equal length to `maxLength`.
- By default `…` is used to mark shrinked parts of the path, configurable by the `ellipis` argument.
- Path segments shrinking can be configured by `minSegmentLength`. Defaults to `maxLength / 3`. Set to `Infinity` to disable segment shrinking.
- The algorithm will try to expand shrinked segments to produce result with equal length to `maxLength`.
- Windows paths are always normalized to Unix style.

## Usage

```js
const shrinkPath = require('shrink-path');

shrinkPath('c:\\Windows\\System32\\WindowsPowerShell\\v1.0\\Modules\\TroubleshootingPack\\en-US\\Microsoft.Windows.Diagnosis.TroubleshootingPack.dll-Help.xml', 60);
// c:/Windows/…/TroubleshootingPack/en-US/Microsoft.…l-Help.xml

shrinkPath('c:\\Windows\\System32\\WindowsPowerShell\\v1.0\\Modules\\TroubleshootingPack\\en-US\\Microsoft.Windows.Diagnosis.TroubleshootingPack.dll-Help.xml', 60, 0);
// c:/Windows/Sys…m32/Win…ell/v1.0/Modules/Tro…ack/en-US/Mic…ml

shrinkPath('c:\\Windows\\System32\\WindowsPowerShell\\v1.0\\Modules\\TroubleshootingPack\\en-US\\Microsoft.Windows.Diagnosis.TroubleshootingPack.dll-Help.xml', 60, Infinity);
// …/Microsoft.Windows.Diagnosis.TroubleshootingPack.dll-Help.…
```
