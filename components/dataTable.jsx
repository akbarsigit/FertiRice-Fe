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

import Link from "next/link";

export default function DataTable(props) {
  // console.log(props.sensorData);
  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableHeaderCell>Timestamp</TableHeaderCell>
          <TableHeaderCell>Hari Setelah Tanam (HST)</TableHeaderCell>
          <TableHeaderCell>Petak</TableHeaderCell>
          <TableHeaderCell>Nitrogen</TableHeaderCell>
          <TableHeaderCell>Phosphat</TableHeaderCell>
          <TableHeaderCell>Kalium</TableHeaderCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {props.sensorData.map((prop) => (
          <TableRow key={prop.timestamp}>
            <TableCell>{prop.timestamp}</TableCell>
            <TableCell>{prop.hst}</TableCell>
            <TableCell>
              <Text>{prop.petak}</Text>
            </TableCell>
            <TableCell>
              <Text>{prop.n}</Text>
            </TableCell>
            <TableCell>
              <Text>{prop.p}</Text>
            </TableCell>
            <TableCell>
              <Text>{prop.k}</Text>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
