# fbreactions
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
- export AWS variables `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_REGION` for apex to work
- Deploy with `FB_APP_ID`, `FB_APP_SECRET` environment variables at apex
- sample: `apex -s FB_APP_ID='123' -s FB_APP_SECRET='456' deploy`

## Setup
npm install && npm install -g mocha  protractor  webpack  webpack-dev-server  karma-cli

## Upcoming
- refer to issues
- Select by Date
- Quote to share
- More Countries

## Thanks
- @siulun for providing the high resolution pics!
- [mroth/emojitracker](https://github.com/mroth/emojitracker) for inspirations
