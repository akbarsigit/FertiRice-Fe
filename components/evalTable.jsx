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

export default function EvalTable(props) {
  // console.log(props.sensorData);
  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableHeaderCell>Timestamp</TableHeaderCell>
          <TableHeaderCell>Petak</TableHeaderCell>
          <TableHeaderCell>Warna Daun</TableHeaderCell>
          <TableHeaderCell>Tinggi</TableHeaderCell>
          {/* <TableHeaderCell>Lebar Daun</TableHeaderCell> */}
        </TableRow>
      </TableHead>
      <TableBody>
        {props.evalData.map((prop) => (
          <TableRow key={prop.timestamp}>
            <TableCell>{prop.timestamp}</TableCell>
            <TableCell>
              <Text>{prop.petak}</Text>
            </TableCell>
            <TableCell>
              <Text>{prop.warna}</Text>
            </TableCell>
            <TableCell>
              <Text>{prop.tinggi}</Text>
            </TableCell>
            {/* <TableCell>
              <Text>{prop.k}</Text>
            </TableCell> */}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
