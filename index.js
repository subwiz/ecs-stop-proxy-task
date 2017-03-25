const AWS = require('aws-sdk')

const CLUSTER = 'tinyproxy'

AWS.config.region = 'us-east-1'

let run = () => {
  console.log('Starting execution...')
  let ecs = new AWS.ECS()
  var params = {
    cluster: CLUSTER,
    desiredStatus: 'RUNNING'
  }
  ecs.listTasks(params, (err, data) => {
    if (err) {
      console.log(err, err.stack)
    }
    else {
      console.log(data.taskArns)
      for(let taskArn of data.taskArns) {
        stop(ecs, taskArn)
      }
    }
  })
}

let stop = (ecs, taskArn) => {
  let params = {
    task: taskArn,
    cluster: CLUSTER,
    reason: 'Daily restart'
  }
  ecs.stopTask(params, (err, data) => {
    if (err) {
      console.log(err, err.stack)
    }
    else {
      console.log(data)
      console.log('done')
    }
  })
}

exports.handler = (event, context, callback) => {
  run()
  callback(null, 'Stopped')
}
