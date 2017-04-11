
import TextReverserService from './text-reverser.service';

describe('Text reverser service', function() {

	let service;
	let testInput = 'This is a product for Wordsmith';
	let testOutput = 'sihT si a tcudorp rof htimsdroW';

	beforeEach(function() {
        service = new TextReverserService();
    });

	it('should reverse a word/sentence', function() {
		expect(service.reverse(testInput)).toEqual(testOutput);
	});

});
