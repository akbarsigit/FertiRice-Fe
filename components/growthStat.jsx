"use client";
import {
  Table,
  TableHead,
  TableRow,
  TableHeaderCell,
  TableBody,
  TableCell,
  Text,
} from "@tremor/react";
import { BadgeDelta, Flex, Metric } from "@tremor/react";

export function PositiveGrowthStat(props) {
  //   console.log(props.sensorData);
  const categorie = props.cat;
  return (
    <div>
      <BadgeDelta
        deltaType="moderateIncrease"
        isIncreasePositive={true}
        size="xs"
      >
        {/* {100 * ((props.final - props.start) / props.start).toFixed(3)}% */}
        
         {100 *Math.round(((props.final - props.start) / props.start)* 100) / 100 }% 
      </BadgeDelta>
    </div>
  );
}

export function NegativeGrowthStat(props) {
  //   console.log(props.sensorData);
  return (
    <div>
      <BadgeDelta
        deltaType="moderateDecrease"
        isIncreasePositive={true}
        size="xs"
      >
        {100 *Math.round(((props.final - props.start) / props.start)* 100) / 100 }%
      </BadgeDelta>
    </div>
  );
}

export function NetralGrowthStat(props) {
  //   console.log(props.sensorData);
  return (
    <div>
      <BadgeDelta deltaType="unchanged" isIncreasePositive={true} size="xs">
        {100 *Math.round(((props.final - props.start) / props.start)* 100) / 100 }%
      </BadgeDelta>
    </div>
  );
}
