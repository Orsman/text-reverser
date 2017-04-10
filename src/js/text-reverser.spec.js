
describe('Text reverser service', function() {

	var TextReverserService;
	var testInput = 'This is a product for Wordsmith';
	var testOutput = 'sihT si a tcudorp rof htimsdroW';

	beforeEach(angular.mock.module('textReverser'));

	beforeEach(inject(function(_TextReverserService_) {
		TextReverserService = _TextReverserService_;
    }));

	it('should reverse a word/sentence', function() {
		expect(TextReverserService.reverse(testInput)).toEqual(testOutput);
	});

});
