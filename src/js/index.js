import angular from 'angular';
import ngSanitize from 'angular-sanitize';

import textReverserComponent from './text-reverser.component';
// import textReverserService from './text-reverser.service';

angular.module('textReverser', ['ngSanitize'])
    // .service('TextReverserService', textReverserService)
    .component('textReverser', textReverserComponent)
;
