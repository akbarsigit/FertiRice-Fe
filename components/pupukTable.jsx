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

export default function PupukTable(props) {
  console.log(props);
  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableHeaderCell>Timestamp</TableHeaderCell>
          <TableHeaderCell>Hari Setelah Tanam (HST)</TableHeaderCell>
          <TableHeaderCell>Petak</TableHeaderCell>
          <TableHeaderCell>Jumlah Pemupukan Nitrogen (gr)</TableHeaderCell>
          <TableHeaderCell>Jumlah Pemupukan Phosphat (gr)</TableHeaderCell>
          <TableHeaderCell>Jumlah Pemupukan Kalium (gr)</TableHeaderCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {props.pupuk.map((prop) => (
          <TableRow key={prop.timestamp}>
            <TableCell>{prop.timestamp}</TableCell>
            <TableCell>{prop.hst}</TableCell>
            <TableCell>
              <Text>{prop.petak}</Text>
            </TableCell>
            <TableCell>
              <Text>{prop.dosisn}</Text>
            </TableCell>
            <TableCell>
              <Text>{prop.dosisp}</Text>
            </TableCell>
            <TableCell>
              <Text>{prop.dosisk}</Text>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
