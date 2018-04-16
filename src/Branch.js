import React, { Component } from 'react'

import difference_in_minutes from 'date-fns/difference_in_minutes'
import map from 'lodash.map'

import { line1, line2 } from './formatLatestAnnouncement'

export default class Branch extends Component {
  fontSize() {
    const normal = 0.3

    const sizes = {
      normal: normal,
      expanded: normal / 2,
      collapsed: normal * 2,
    }

    return sizes[this.props.size]
  }

  render() {
    const trainText = train => {
      return [
        <tspan
          x="0.05"
          dy={this.fontSize() * dy(this.props.trains.length)}
          fill={color(train.actual)}
          key={train.actual.AdvertisedTrainIdent + 1}
        >
          {line1(train, this.props.stations)}
        </tspan>,
        <tspan
          x="0.05"
          dy={this.fontSize()}
          fill={color(train.actual)}
          key={train.actual.AdvertisedTrainIdent + 2}
        >
          {line2(train, this.props.stations)}
        </tspan>,
      ]
    }
    return (
      <g className={`pos-${this.props.position}`}>
        <rect
          onClick={this.props.expand}
          className="branch"
          x="0"
          y="0"
          height="4"
          width="4"
        />
        <text className="train" style={{ fontSize: this.fontSize() }}>
          {map(this.props.trains, trainText)}
        </text>
      </g>
    )
  }
}

function color(a) {
  const delay = minutes(a)
  return delay < 1
    ? '#0f0'
    : delay < 2
      ? '#fff'
      : delay < 4
        ? '#ff0'
        : delay < 8
          ? '#f80'
          : '#f00'
}

function minutes(a) {
  return difference_in_minutes(a.TimeAtLocation, a.AdvertisedTimeAtLocation)
}

function dy(l) {
  if (l === 1) return 6
  if (l === 2) return 4 * (4 - 1.2) / 3
  if (l === 3) return 4 * (4 - 1.2) / (l + 1)
  if (l === 5) return 1.5
  if (l === 6) return 1.15
  if (l === 7) return 0.85
  return 4 * (4 - 1.2) / (l + 1)
}
