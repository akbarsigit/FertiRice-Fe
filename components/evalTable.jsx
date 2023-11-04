"use client";
import {
  Table,
  TableHead,
  TableRow,
  TableHeaderCell,
  TableBody,
  TableCell,
  Text,
  Card,
} from "@tremor/react";

export default function EvalTable(props) {
  // color chart
  const color = [
    "bg-[#81B81F]",
    "bg-[#5E941A]",
    "bg-[#467319]",
    "bg-[#335B19]",
  ];

  function colorRender(colorCode) {
    if (colorCode == 1) {
      return <Card className={`w-2 ${color[0]}`}></Card>;
    } else if (colorCode == 2) {
      return <Card className={`w-2 ${color[1]}`}></Card>;
    } else if (colorCode == 3) {
      return <Card className={`w-2 ${color[2]}`}></Card>;
    } else if (colorCode == 4) {
      return <Card className={`w-2 ${color[3]}`}></Card>;
    } else return colorCode;
  }
  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableHeaderCell>Timestamp</TableHeaderCell>
          <TableHeaderCell>Petak</TableHeaderCell>
          <TableHeaderCell>Hari Setelah Tanam</TableHeaderCell>
          <TableHeaderCell>Warna Daun</TableHeaderCell>
          <TableHeaderCell>Tinggi</TableHeaderCell>
          <TableHeaderCell>Lebar Daun</TableHeaderCell>
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
              <Text>{prop.hst}</Text>
            </TableCell>
            <TableCell>
              <Text>{colorRender(prop.warna)}</Text>
            </TableCell>
            <TableCell>
              <Text>{prop.tinggi}</Text>
            </TableCell>
            <TableCell>
              <Text>{prop.lebar}</Text>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
