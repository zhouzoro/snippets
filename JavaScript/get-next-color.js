getNextColor = function() {
    var colors = [{
        name: 'red',
        rgb: 'rgb(255, 0, 0)',
        hex: '#FF0000'
    }, {
        name: 'orange',
        rgb: 'rgb(255, 165, 0)',
        hex: '#FFA500'
    }, {
        name: 'yellow',
        rgb: 'rgb(255, 255, 0)',
        hex: '#FFFF00'
    }, {
        name: 'olive',
        rgb: 'rgb(128, 128, 0)',
        hex: '#808000'
    }, {
        name: 'green',
        rgb: 'rgb(0, 128, 0)',
        hex: '#008000'
    }, {
        name: 'teal',
        rgb: 'rgb(0, 128, 128)',
        hex: '#008080'
    }, {
        name: 'blue',
        rgb: 'rgb(0, 0, 255)',
        hex: '#0000FF'
    }, {
        name: 'purple',
        rgb: 'rgb(128, 0, 128)',
        hex: '#800080'
    }, {
        name: 'violet',
        rgb: 'rgb(238, 130, 238)',
        hex: '#EE82EE'
    }, {
        name: 'pink',
        rgb: 'rgb(255, 192, 203)',
        hex: '#FFC0CB'
    }, {
        name: 'brown',
        rgb: 'rgb(165, 42, 42)',
        hex: '#A52A2A'
    }, {
        name: 'gray',
        rgb: 'rgb(128, 128, 128)',
        hex: '#808080'
    }, {
        name: 'black',
        rgb: 'rgb(0, 0, 0)',
        hex: '#000000'
    }];
    var nextI = 0;
    return function() {
        nextI++;
        return colors[nextI];
    }
}();
