
import 'angular';
import 'angular-sanitize';

// import textReverser from './text-reverser';
import textReverser from './text-reverser/text-reverser.component';

angular
	// .module('ws.textReverser', ['ngSanitize', 'wordsmith.textReverser'])
	.module('wordsmith.textReverser', ['ngSanitize'])
	.component('textReverser', textReverser)
;
