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
import { BarList, Bold } from "@tremor/react";
import { notifyError, notifySuccess } from "@/components/notify";

export default function Home() {
  const [allData, setAllData] = useState([]);
  const [evaluation, setEvaluation] = useState([]);
  const [chartVal, setChartVal] = useState(null);

  // Recent Value For Each Petak
  const [recentP1, setRecentP1] = useState([]);
  const [recentP2, setRecentP2] = useState([]);
  const [recentP3, setRecentP3] = useState([]);
  const [recentP4, setRecentP4] = useState([]);
  const [recentP5, setRecentP5] = useState([]);

  // Keeping those value on singgle array
  const dataSets = [
    { name: "Petak 1", data: recentP1 },
    { name: "Petak 2", data: recentP2 },
    { name: "Petak 3", data: recentP3 },
    { name: "Petak 4", data: recentP4 },
    { name: "Petak 5", data: recentP5 },
  ];

  const [formValue, setformValue] = React.useState({
    warna: "",
    tinggi: "",
    lebar: "",
    petak: "",
    hst: "",
  });

  const handleChange = (event) => {
    setformValue({
      ...formValue,
      [event.target.name]: event.target.value,
    });
  };

  async function sendEval(event) {
    // console.log(formValue);
    event.preventDefault();
    try {
      await axiosInstance.post(`/eval`, {
        warna: formValue.warna,
        tinggi: formValue.tinggi,
        lebar: formValue.lebar,
        petak: formValue.petak,
        hst: formValue.hst,
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
        const [npkRekomenResponse, evaluationResponse, p1, p2, p3, p4, p5] =
          await Promise.all([
            axiosInstance.get(`/`),
            axiosInstance.get(`/eval`),
            axiosInstance.get(`/npk/latest/1`),
            axiosInstance.get(`/npk/latest/2`),
            axiosInstance.get(`/npk/latest/3`),
            axiosInstance.get(`/npk/latest/4`),
            axiosInstance.get(`/npk/latest/5`),
          ]);

        console.log(p1.data.data.data);
        const setRecentState = (data, setStateFunction) => {
          setStateFunction(
            Object.keys(data).map((key) => ({
              name: key,
              value: parseInt(data[key], 10),
            }))
          );
        };

        setRecentState(p1.data.data.data[0], setRecentP1);
        setRecentState(p2.data.data.data[0], setRecentP2);
        setRecentState(p3.data.data.data[0], setRecentP3);
        setRecentState(p4.data.data.data[0], setRecentP4);
        setRecentState(p5.data.data.data[0], setRecentP5);

        setAllData(npkRekomenResponse.data.data.data);
        setEvaluation(evaluationResponse.data.data.data);
      } catch (err) {
        console.log(err);
      }
    })();
  }, []);

  // console.log(chartVal);

  return (
    <main className="p-4 md:p-10 mx-auto">
      <Title className="!text-black">Ferti Rice Dashboard</Title>

      {/* Increase Card */}
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
          maxValue={150}
          minValue={30}
        />
        <Accordion className="max-w-md ">
          <AccordionHeader>Accordion 1</AccordionHeader>
          <AccordionBody>{chartVal}</AccordionBody>
        </Accordion>
      </Card>

      {/* Table All data */}
      <Text className="!text-black !mt-4">Data Hasil Pengambilan Sensor</Text>
      <Card className="w-full md:order-none !mt-1">
        <DataTable sensorData={allData} />
      </Card>

      {/* Bar List data */}
      <Card className="mt-5">
        <Title className="mb-2">
          Hasil Pembacaan NPK Terakhir untuk Tiap Petak
        </Title>
        <Flex justifyContent="start" className="flex flex-wrap flex-row gap-4">
          {dataSets.map((dataSet, index) => (
            <Card className="max-w-md">
              <Title>Petak Nomer {index + 1}</Title>
              <Flex className="mt-4">
                <Text>
                  <Bold>Nutrition</Bold>
                </Text>
                <Text>
                  <Bold>Value</Bold>
                </Text>
              </Flex>
              <BarList data={dataSet.data} className="mt-2" />
            </Card>
          ))}
        </Flex>
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
                Hari Setelah Tanam (HST)
              </label>
              <input
                type="text"
                name="hst"
                value={formValue.hst}
                onChange={handleChange}
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="1"
                required
              />
            </div>
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
            <div class="mb-6">
              <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Lebar Daun
              </label>
              <input
                type="text"
                name="lebar"
                value={formValue.lebar}
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
