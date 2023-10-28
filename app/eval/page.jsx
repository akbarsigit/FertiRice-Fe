"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { axiosInstance } from "./../../utils/config";
import { Card, Title, Text } from '@tremor/react';


export default function Eval() {

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
    <main className="p-4 md:p-10 mx-auto">
        <Title >Ferti Rice Dashboard</Title>
        <Text>
          Evaluasi Data
        </Text>

        
    </main>
  )
}
