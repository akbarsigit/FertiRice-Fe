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
  Legend
} from "@tremor/react";
import { BadgeDelta, Flex, Metric } from "@tremor/react";
import { BarList, Bold } from "@tremor/react";
import { notifyError, notifySuccess } from "@/components/notify";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@tremor/react";

export default function Home() {
  const [dataLoaded, setDataLoaded] = useState(false);

  const [allData, setAllData] = useState([]);
  const [evaluation, setEvaluation] = useState([]);
  const [chartVal, setChartVal] = useState(null);

  // Recent Value For Each Petak
  const [recentP1, setRecentP1] = useState([]);
  const [recentP2, setRecentP2] = useState([]);
  const [recentP3, setRecentP3] = useState([]);
  const [recentP4, setRecentP4] = useState([]);
  const [recentP5, setRecentP5] = useState([]);

  // Value For Each Petak
  const [npkP1, setNpkP1] = useState([]);
  const [npkP2, setNpkP2] = useState([]);
  const [npkP3, setNpkP3] = useState([]);
  const [npkP4, setNpkP4] = useState([]);
  const [npkP5, setNpkP5] = useState([]);

  // Keeping those value on singgle array
  const dataSets = [
    { name: "Petak 1", data: recentP1 },
    { name: "Petak 2", data: recentP2 },
    { name: "Petak 3", data: recentP3 },
    { name: "Petak 4", data: recentP4 },
    { name: "Petak 5", data: recentP5 },
  ];

  const dataSetsNPK = [npkP1, npkP2, npkP3, npkP4, npkP5];

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
            axiosInstance.get(`/npk/5`),
            axiosInstance.get(`/npk/1`),
            axiosInstance.get(`/npk/2`),
            axiosInstance.get(`/npk/3`),
            axiosInstance.get(`/npk/4`),
            axiosInstance.get(`/npk/5`),
          ]);

        // console.log(p1.data.data.data);
        const setRecentState = (data, setStateFunction) => {
          setStateFunction(
            Object.keys(data)
              .filter((key) => key !== "timestamp") // Exclude the 'timestamp' key
              .map((key) => ({
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

        setNpkP1(p1.data.data.data);
        setNpkP2(p2.data.data.data);
        setNpkP3(p3.data.data.data);
        setNpkP4(p4.data.data.data);
        setNpkP5(p5.data.data.data);

        // console.log(p5.data.data.data[0]["n"]);

        setAllData(npkRekomenResponse.data.data.data);
        setEvaluation(evaluationResponse.data.data.data);

        setDataLoaded(true);
      } catch (err) {
        console.log(err);
      }
    })();
  }, []);

  // console.log(chartVal);

  return (
    <main className="p-4 md:p-10 mx-auto">
      {dataLoaded ? (
        <div>
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
          <TabGroup>
            <TabList className="mt-8">
              <Tab>Petak 1</Tab>
              <Tab>Petak 2</Tab>
              <Tab>Petak 3</Tab>
              <Tab>Petak 4</Tab>
              <Tab>Petak 5</Tab>
            </TabList>
            <Title className="mt-4">
              Nitrogen, Phosphat, Kalium Growth Rates
            </Title>
            <TabPanels>
              {dataSetsNPK.map((dataSet, index) => (
                <TabPanel>
                  <Card className="mt-4">
                    <Title>Petak Nomer {index + 1}</Title>
                    <Text className="mt-4">Growth Percentage</Text>
                    {/* Increase Card */}
                    <Card className="max-w-sm mt-1">
                      <Flex justifyContent="between" alignItems="center">
                        <Text>Petak 1 (N)</Text>
                        <BadgeDelta
                          deltaType="moderateIncrease"
                          isIncreasePositive={true}
                          size="xs"
                        >
                          +{JSON.stringify(dataSet[0].n)}%
                        </BadgeDelta>
                      </Flex>
                      <Metric></Metric>
                    </Card>

                    <Text className="mt-4">Growth History</Text>
                    <LineChart
                      className="mt-2"
                      data={dataSet}
                      index="timestamp"
                      categories={["n", "p", "k"]}
                      colors={["emerald", "gray", "blue"]}
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
                </TabPanel>
              ))}
            </TabPanels>
          </TabGroup>

          {/* Table All data */}
          <Text className="!text-black !mt-4">
            Data Hasil Pengambilan Sensor
          </Text>
          <Card className="w-full md:order-none !mt-1">
            <DataTable sensorData={allData} />
          </Card>

          {/* Bar List data */}
          <Card className="mt-5">
            <Title className="mb-2">
              Hasil Pembacaan NPK Terakhir untuk Tiap Petak
            </Title>
            <Flex
              justifyContent="start"
              className="flex flex-wrap flex-row gap-4"
            >
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

          {/* Plot Petak P */}
          <Card className="mt-5">
            <Title className="mb-2">
              Plot petak nilai P
            </Title>
            <Legend className = "place-self-end mb-4" categories={["Tinggi", "Sedang", "Rendah"]} colors={["lime", "slate", "red"]}/>
            <Flex
              justifyContent="start"
              className="grid grid-cols-5 gap-4"
            >
              {dataSets.map((dataSet, index) => (
                <Card className={`w-1/8 h-60 ${ dataSet.data[1]['value'] > 40 ? "bg-lime-500" : dataSet.data[1]['value'] > 20 ? "bg-gray-200" : "bg-red-500"} `}>
                  <Title className="text-center">Petak Nomer {index + 1}</Title>
                  <Text className="text-center mt-10 text-2xl">P: {dataSet.data[1]["value"]}</Text>
                </Card>
              ))}
            </Flex>
          </Card>

          {/* Plot Petak L */}
          <Card className="mt-5">
            <Title className="mb-2">
              Plot petak nilai K
            </Title>
            <Legend className = "place-self-end mb-4" categories={["Tinggi", "Sedang", "Rendah"]} colors={["lime", "slate", "red"]}/>
            <Flex
              justifyContent="start"
              className="grid grid-cols-5 gap-4"
            >
              {dataSets.map((dataSet, index) => (
                <Card className={`w-1/8 h-60 justify-content-center ${ dataSet.data[2]['value'] > 40 ? "bg-lime-500" : dataSet.data[2]['value'] > 20 ? "bg-gray-200" : "bg-red-500"} `}>
                  <Title className="text-center">Petak Nomer {index + 1}</Title>
                  <Text className="text-center mt-10 text-2xl">K: {dataSet.data[2]["value"]}</Text>
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
          <Text className="!text-black !mt-5">
            Form Pengiriman Data Evaluasi
          </Text>
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
        </div>
      ) : (
        <div
          role="status"
          class="absolute -translate-x-1/2 -translate-y-1/2 top-2/4 left-1/2"
        >
          <svg
            aria-hidden="true"
            class="w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
            viewBox="0 0 100 101"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
              fill="currentColor"
            />
            <path
              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
              fill="currentFill"
            />
          </svg>
          <span class="sr-only">Loading...</span>
        </div>
      )}
    </main>
  );
}
