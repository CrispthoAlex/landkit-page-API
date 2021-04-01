const { random } = require("lodash");
const { url } = require("node:inspector");

module.exports = function () {
    let faker = require("faker");
    let _ = require("lodash");
    return {
        users: _.times(50, function (n) {
            let genereR;
            if (random(50) % 2 === 0)
                genereR = "women";
            else
                genereR = "men";
            
            return {
                id: n,
                name: faker.name.findName(),
                avatar: 'https://randomuser.me/api/portraits/' + genereR + '/' + n + '.jpg' 
            }
        }),
        blogs: _.times(200, function (n) {
            return {
                id: n,
                userId: faker.random(50),
                body: url('')
            }
        })
    }
}