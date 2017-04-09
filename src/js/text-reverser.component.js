
const textReverserComp = {
	bindings: {
		input: '<'
	},
	controller: function() {
        const ctrl = this;
        this.output = '';
        this.reverse = reverse;

        function reverse(input) {
            const array = input.split(' ');
            let newArr = [];

            for (var i = 0; i < array.length; i++) {
                newArr.push( array[i].split('').reverse().join('') );
            }

            ctrl.output = newArr.join(' ');
        }
    },
	templateUrl: 'text-reverser-tpl.html'
};

export default textReverserComp;
