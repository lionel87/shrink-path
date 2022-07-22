import { shrinkPath } from './esm/index.js';

const tests = [{
	length: 60,
	path: 'c:\\Windows\\System32\\WindowsPowerShell\\v1.0\\Modules\\TroubleshootingPack\\en-US\\Microsoft.Windows.Diagnosis.TroubleshootingPack.dll-Help.xml',
	expected: 'c:/Windows/…/TroubleshootingPack/en-US/Microsoft.…l-Help.xml',
},{
	length: 60,
	segment: 12,
	path: 'c:\\Windows\\System32\\WindowsPowerShell\\v1.0\\Modules\\TroubleshootingPack\\en-US\\Microsoft.Windows.Diagnosis.TroubleshootingPack.dll-Help.xml',
	expected: 'c:/Windows/System32/…/Troubles…ingPack/en-US/Microso…elp.xml',
},{
	length: 50,
	path: 'c:\\Windows\\System32\\WindowsPowerShell\\v1.0\\Modules\\TroubleshootingPack\\en-US\\Microsoft.Windows.Diagnosis.TroubleshootingPack.dll-Help.xml',
	expected: 'c:/Windows/…/en-US/Microsoft.Windo…ck.dll-Help.xml',
},{
	length: 50,
	segment: 7,
	path: 'c:\\Windows\\System32\\WindowsPowerShell\\v1.0\\Modules\\TroubleshootingPack\\en-US\\Microsoft.Windows.Diagnosis.TroubleshootingPack.dll-Help.xml',
	expected: 'c:/Windows/Sys…m32/…/Modules/Tro…ack/en-US/Mic…xml',
},{
	length: 30,
	path: 'c:\\Windows\\System32\\WindowsPowerShell\\v1.0\\Modules\\TroubleshootingPack\\en-US\\Microsoft.Windows.Diagnosis.TroubleshootingPack.dll-Help.xml',
	expected: 'c:/Windows/…/en-US/Micro…p.xml',
},{
	length: 60,
	segment: Infinity,
	path: 'c:\\Windows\\System32\\WindowsPowerShell\\v1.0\\Modules\\TroubleshootingPack\\en-US\\Microsoft.Windows.Diagnosis.TroubleshootingPack.dll-Help.xml',
	expected: '…/Microsoft.Windows.Diagnosis.TroubleshootingPack.dll-Help.…',
}];

let hasError = false;
for (const test of tests) {
	const short = shrinkPath(test.path, test.length, test.segment);
	if (short.length !== test.length && (Number.isFinite(test.segment) || typeof test.segment === 'undefined')) {
		console.error(`ERROR: Invalid length for ${test.path}\nExpected: ${test.length}\nGot:      ${short.length}`);
		hasError = true;
	}
	if (short !== test.expected) {
		console.error(`Warning for ${test.path}\nExpected: ${test.expected}\nGot:      ${short}`);
	}
}

if (hasError) {
	process.exit(1);
}
