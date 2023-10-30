"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { axiosInstance } from "./../utils/config";
import { Card, Title, Text, LineChart } from "@tremor/react";
import DataTable from "./../components/dataTable";
import EvalTable from "./../components/evalTable";
import { Alert } from "flowbite-react";
import React from "react";
import {
  Accordion,
  AccordionHeader,
  AccordionBody,
  AccordionList,
} from "@tremor/react";
import { BadgeDelta, Flex, Metric } from "@tremor/react";

// import { notifyError, notifySuccess } from "@/components/notify";

export default function Home() {
  const [allData, setAllData] = useState([]);
  const [evaluation, setEvaluation] = useState([]);
  const [chartVal, setChartVal] = useState(null);

  const [formValue, setformValue] = React.useState({
    warna: "",
    tinggi: "",
    petak: "",
  });

  const handleChange = (event) => {
    setformValue({
      ...formValue,
      [event.target.name]: event.target.value,
    });
  };

  async function sendEval(event) {
    console.log(formValue);
    event.preventDefault();
    try {
      await axiosInstance.post(`/eval`, {
        warna: formValue.warna,
        tinggi: formValue.tinggi,
        petak: formValue.petak,
      });
      notifySuccess("Berhasil Mengirim Data");
    } catch (err) {
      notifyError(err);
      console.log(err);
    }
  }

  // get data dashboard
  useEffect(() => {
    (async () => {
      try {
        const [npkRekomenResponse, evaluationResponse] = await Promise.all([
          axiosInstance.get(`/`),
          axiosInstance.get(`/eval`),
        ]);
        // console.log(npkRekomenResponse.data.data.data);
        setAllData(npkRekomenResponse.data.data.data);
        setEvaluation(evaluationResponse.data.data.data);
      } catch (err) {
        console.log(err);
      }
    })();
  }, []);

  console.log(chartVal);

  return (
    <main className="p-4 md:p-10 mx-auto">
      <Title className="!text-black">Ferti Rice Dashboard</Title>

      <Card className="max-w-sm mt-4">
        <Flex justifyContent="between" alignItems="center">
          <Text>Petak 1 (N)</Text>
          <BadgeDelta
            deltaType="moderateIncrease"
            isIncreasePositive={true}
            size="xs"
          >
            +{12.3}%
          </BadgeDelta>
        </Flex>
        <Metric></Metric>
      </Card>

      {/* Line Chart */}
      <Card className="mt-4">
        <Title>Nitrogen, Phosphat, Kalium Growth Rates</Title>
        <LineChart
          className="mt-6"
          data={allData}
          index="timestamp"
          categories={["n", "p", "k"]}
          colors={["emerald", "gray"]}
          // valueFormatter={valueFormatter}
          onValueChange={(v) => setChartVal(JSON.stringify(v))}
          connectNulls={true}
          yAxisWidth={40}
        />
        <Accordion className="max-w-md ">
          <AccordionHeader>Accordion 1</AccordionHeader>
          <AccordionBody>{chartVal}</AccordionBody>
        </Accordion>
      </Card>

      <Text className="!text-black !mt-4">Data Hasil Pengambilan Sensor</Text>
      {/* Table All data */}
      <Card className="w-full md:order-none !mt-1">
        <DataTable sensorData={allData} />
      </Card>

      {/* Tabel Evaluasi */}
      <Text className="!text-black !mt-5">Data Evaluasi Tanaman</Text>
      <Card className="w-full md:order-none !mt-1">
        <EvalTable evalData={evaluation} />
      </Card>

      {/* Form evaluasi */}
      <Text className="!text-black !mt-5">Form Pengiriman Data Evaluasi</Text>
      <Card className="w-full md:order-none !mt-1">
        <div className="">
          <form onSubmit={sendEval}>
            <div class="mb-6">
              <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Petak
              </label>
              <input
                type="text"
                name="petak"
                value={formValue.petak}
                onChange={handleChange}
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="1"
                required
              />
            </div>
            <div class="mb-6">
              <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Warna
              </label>
              <input
                type="text"
                name="warna"
                value={formValue.warna}
                onChange={handleChange}
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="1"
                required
              />
            </div>
            <div class="mb-6">
              <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Tinggi
              </label>
              <input
                type="text"
                name="tinggi"
                value={formValue.tinggi}
                onChange={handleChange}
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="1"
                required
              />
            </div>
            <button
              type="submit"
              class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              Submit
            </button>
          </form>
        </div>
      </Card>
    </main>
  );
}
