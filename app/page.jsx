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

  // useEffect(() => {
  //   (async () => {
  //     try {
  //       await axiosInstance.get("/eval").then((res) => {
  //         setallData(res.data.data.data);
  //       });
  //     } catch (err) {
  //       console.log(err);
  //     }
  //   })();
  // }, []);


  function sendEval(){

  }

  return (
    <main className="p-4 md:p-10 mx-auto">
        <Title className="!text-black">Ferti Rice Dashboard</Title>
        <Text className="!text-black">
          Data Hasil Pengambilan Sensor 
        </Text>

        <Card className="w-full md:order-none order-last md:mt-0 !mt-4" >
          <DataTable sensorData={allData} />
        </Card>

        {/* evaluasi */}
        <div className="">
          <form onSubmit={sendEval}>
            <input type="text" name="tinggi"/>
            <button type="submit" name="halo">
                Submit
            </button>
          </form>
        </div>
    </main>
  )
}
