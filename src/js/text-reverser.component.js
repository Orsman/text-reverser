
const textReverserComp = {
	controller: function(TextReverserService) {
        this.output = '';

        this.reverse = (input) => this.output = TextReverserService.reverse(input);
    },
	templateUrl: 'text-reverser-tpl.html'
};

export default textReverserComp;
