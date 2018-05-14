const Mock = require('mockjs');

module.exports = {
    "profile": {
        "name": "Mu Wei"
    },
    comments: Mock.mock({
        "status": "success",
        "message": "",
        "result|100": [{
            "id|+1": 1,
            "author": "@name",
            "comment": "@cparagraph",
            "date": "@datetime"
        }]
    })
}