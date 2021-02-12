#! /usr/bin/env node

const readline = require('readline')
const R = require('ramda')
const { WebClient } = require('@slack/client')

const { APP, CHANNEL, SLACK_TOKEN } = process.env

const web = new WebClient(SLACK_TOKEN)

const send = (text) => web.chat.postMessage({ channel: CHANNEL, text: msg })

// Pipe everything to stdout
process.stdin.pipe(process.stdout)

const rl = readline.createInterface({
  input: process.stdin,
  terminal: false,
})

const tripleBackTick = (msg: string) => ['```', msg, '```'].join('')

rl.on('line', (line) => {
  try {
    const parsed = JSON.parse(line)
    if (parsed.level === 50) {
      send(
        [
          `Something went wrong with ${APP}`,
          tripleBackTick(parsed.msg),
          tripleBackTick(JSON.stringify(R.omit(['msg'], parsed), null, 2)),
        ].join('\n')
      )
    } else if (parsed.level === 40) {
      slack.send(
        [
          `Something needs attention at ${APP}`,
          tripleBackTick(JSON.stringify(parsed, null, 2)),
        ].join('\n')
      )
    }
  } catch (ignored) {
    // ignore errors
  }
})
