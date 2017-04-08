
import 'angular';
import 'angular-sanitize';

// import textReverser from './text-reverser';
import textReverser from './text-reverser/text-reverser.component';

angular
	// .module('ws.textReverser', ['ngSanitize', 'wordsmith.textReverser'])
	.module('ws.textReverser', ['ngSanitize'])
	.component('textReverser', textReverser)
;
