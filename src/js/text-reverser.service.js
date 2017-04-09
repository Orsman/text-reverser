
class textReverserService {

    constructor() {

    }

    reverse(input) {
        const array = input.split(' ');
        let newArr = [];

        for (var i = 0; i < array.length; i++) {
            newArr.push( array[i].split('').reverse().join('') );
        }

        return newArr.join(' ');
    }
}

export default textReverserService;
