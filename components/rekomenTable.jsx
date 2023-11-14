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


export default function RekomenTable(props) {
  // console.log(props.sensorData);
  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableHeaderCell>Timestamp</TableHeaderCell>
          <TableHeaderCell>Petak</TableHeaderCell>
          <TableHeaderCell>Rekomendasi Dosis N (gram)</TableHeaderCell>
          <TableHeaderCell>Rekomendasi Dosis P (gram)</TableHeaderCell>
          <TableHeaderCell>Rekomendasi Dosis K (gram)</TableHeaderCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {props.rekomenData.map((prop) => (
          <TableRow key={prop.timestamp}>
            <TableCell>{prop.timestamp}</TableCell>
            <TableCell>
              <Text>{prop.petak}</Text>
            </TableCell>
            <TableCell>
              <Text>{prop.dosagerecomendationn}</Text>
            </TableCell>
            <TableCell>
              <Text>{prop.dosagerecomendationp}</Text>
            </TableCell>
            <TableCell>
              <Text>{prop.dosagerecomendationk}</Text>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
