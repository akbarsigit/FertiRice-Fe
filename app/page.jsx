"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { axiosInstance } from "./../utils/config";
import { Card, Title, Text } from '@tremor/react';
import DataTable  from './../components/dataTable';


export default function Home() {

  const [allData, setallData] = useState([]);

  // get data dashboard
  useEffect(() => {
    (async () => {
      try {
        await axiosInstance.get("/").then((res) => {
          setallData(res.data.data.data);
        });
      } catch (err) {
        console.log(err);
      }
    })();
  }, []);

  return (
    <main className="p-4 md:p-10 mx-auto max-w-7xl ">
        <Title >Ferti Rice Dashboard</Title>
        <Text>
          Data Hasil Pengambilan Sensor 
        </Text>

        <Card className="max-w-xs mt-4" >
          <DataTable sensorData={allData} />
        </Card>
    </main>
  )
}
