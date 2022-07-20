# shrink-path

Utility to shrink file paths to a given length.

## Docs

`shrinkPath(path: string, maxLength: number; minSemgmentLength: number = maxLength / 3, ellipsis: string = '…'): string;`

- The result will always be shorter or equal length to `maxLength`.
- By default `…` is used to mark shrinked parts of the path, configurable by the `ellipis` argument.
- To disable path segments shrinking set `minSegmentLength` to `Infinity`.
- When path segment shrinking is active, the result length will always equal to `maxLength`. Otherwise it can be shorter.
- Windows paths are always normalized to Unix style.

## Usage

```js
const { shrinkPath } = require('shrink-path');

shrinkPath('c:\\Windows\\System32\\WindowsPowerShell\\v1.0\\Modules\\TroubleshootingPack\\en-US\\Microsoft.Windows.Diagnosis.TroubleshootingPack.dll-Help.xml', 60);
// c:/Windows/…/TroubleshootingPack/en-US/Microsoft.…l-Help.xml
```
