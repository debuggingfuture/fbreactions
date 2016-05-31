# fbreactions
- http://slides.com/chunyinvincentlau/deck-26#/
- Live at [fbreactions.io](fbreactions.io)
- [港台媒體FB心情數據分析](https://slides.com/chunyinvincentlau/fbreactions)
- [Making of fbreactions.io](https://slides.com/chunyinvincentlau/fbreactions-making-of/)

# Stack
- UI: ES6 +  angular 1.5 + webpack + semanticui
- Scripts: ES5

## Structure
### Lambda
- Execution is based on [AWS Lambda](https://slides.com/chunyinvincentlau/serverless-aws-lambda)
- deployed using [Apex](https://github.com/apex/apex), v0.9+ with settings in `project.json` and functions in `functions`
- Export `FB_APP_ID`, `FB_APP_SECRET` and AWS variables `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_REGION` to work
- sample: `apex invoke count_store`

## Setup
npm install && npm install -g mocha  protractor  webpack  webpack-dev-server  karma-cli
