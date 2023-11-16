"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { axiosInstance } from "./../utils/config";
import { Card, Title, Text, LineChart } from "@tremor/react";
import DataTable from "./../components/dataTable";
import EvalTable from "./../components/evalTable";
import PupukTable from "./../components/pupukTable";
import RekomenTable from "./../components/rekomenTable";

import {
  PositiveGrowthStat,
  NegativeGrowthStat,
  NetralGrowthStat
} from "@/components/growthStat";
import { Alert } from "flowbite-react";
import React from "react";
import {
  Accordion,
  AccordionHeader,
  AccordionBody,
  AccordionList,
  Legend,
} from "@tremor/react";
import { BadgeDelta, Flex, Metric } from "@tremor/react";
import { BarList, Bold } from "@tremor/react";
import { notifyError, notifySuccess } from "@/components/notify";
import {
  AreaChart,
  Tab,
  TabGroup,
  TabList,
  TabPanel,
  TabPanels,
} from "@tremor/react";

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

  // Keep Value of AVG stats for Tinggi and Lebar
  const [avgEval, setAvgEval] = useState([])

// For NPK Mapping
  const NutrientArray = ["n", "p", "k"];
  const dataSetsNPK = [npkP1, npkP2, npkP3, npkP4, npkP5];

  // Rekomen all var
  const [rekomenAll, setrekomenAll] = useState([])
  // Rekomen latest
  const [rekomendationDosage, setrekomendationDosage] = useState([])

  // Data used for Petak Visualization
  const [transformedData, setTransformedData] = useState([]);

  const [formValue, setformValue] = React.useState({
    warna: "",
    tinggi: "",
    lebar: "",
    petak: "",
    hst: "",
  });

  // Pemupukan
  const [pemupukan, setPemupukan] = useState([]);
  const [formPupuk, setformPupuk] = React.useState({
    dosisN: "",
    dosisP: "",
    dosisK: "",
    petak: "",
    hst: "",
  });

  // Handle evaluasi form value
  const handleChange = (event) => {
    setformValue({
      ...formValue,
      [event.target.name]: event.target.value,
    });
  };

  // Handle pemupukan form value
  const handlePupuk = (event) => {
    setformPupuk({
      ...formPupuk,
      [event.target.name]: event.target.value,
    });
  };

  // Post for evaluasi
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

  // Post for pemupukan
  async function sendPupuk(event) {
    // console.log(formValue);
    event.preventDefault();
    try {
      await axiosInstance.post(`/fertilization`, {
        dosisN: formPupuk.dosisN,
        dosisP: formPupuk.dosisP,
        dosisK: formPupuk.dosisK,
        petak: formPupuk.petak,
        hst: formPupuk.hst,
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
        const [
          npkRekomenResponse,
          statsResponse,
          rekomenAllResponse,
          rekomenResponse,
          pemupukanResponse,
          evaluationResponse,
          p1,
          p2,
          p3,
          p4,
          p5,
        ] = await Promise.all([
          axiosInstance.get(`/`),
          axiosInstance.get(`/eval/stat-avg`),
          axiosInstance.get('/rekomendasi'),
          axiosInstance.get(`/rekomendasi/latest`),
          axiosInstance.get(`/fertilization`),
          axiosInstance.get(`/eval`),
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

        // Data Visualisasi
        const transformData = (inputData, nutrient) => {
          const result = {
            name: nutrient,
          };

          inputData.forEach((petak) => {
            const petakName = petak.name;
            const nutrientData = petak.data.find(
              (item) => item.name === nutrient
            );
            result[petakName] = nutrientData ? nutrientData.value : null;
          });

          return result;
        };
        // Data Visualisasi
        const transformedDataArray = NutrientArray.map((nutrient) =>
          transformData(transformedData, nutrient)
        );

        // Update the state with the transformed data
        setTransformedData(transformedDataArray);

        setRecentState(
          p1.data.data.data[p1.data.data.data.length - 1],
          setRecentP1
        );
        setRecentState(
          p2.data.data.data[p2.data.data.data.length - 1],
          setRecentP2
        );
        setRecentState(
          p3.data.data.data[p3.data.data.data.length - 1],
          setRecentP3
        );
        setRecentState(
          p4.data.data.data[p4.data.data.data.length - 1],
          setRecentP4
        );
        setRecentState(
          p5.data.data.data[p5.data.data.data.length - 1],
          setRecentP5
        );

        setNpkP1(p1.data.data.data);
        setNpkP2(p2.data.data.data);
        setNpkP3(p3.data.data.data);
        setNpkP4(p4.data.data.data);
        setNpkP5(p5.data.data.data);

        setAllData(npkRekomenResponse.data.data.data);
        setEvaluation(evaluationResponse.data.data.data);
        setPemupukan(pemupukanResponse.data.data.data);
        setAvgEval(statsResponse.data.data.data)
        setrekomendationDosage(rekomenResponse.data.data.data)
        setrekomenAll(rekomenAllResponse.data.data.data)

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
                    <Flex
                      justifyContent="start"
                      className="flex flex-wrap flex-row gap-4"
                    >
                      {/* N */}
                      <Card className="max-w-sm mt-1">
                        <Flex justifyContent="between" alignItems="center">
                          <Text>Petak {index + 1} (N)</Text>
                          {dataSet[dataSet.length - 1].n -
                            dataSet[dataSet.length - 2].n <
                          0 ? (
                            <NegativeGrowthStat
                              final={dataSet[dataSet.length - 1].n}
                              start={dataSet[dataSet.length - 2].n}
                            ></NegativeGrowthStat>
                          ) : dataSet[dataSet.length - 1].n -
                              dataSet[dataSet.length - 2].n >
                            0 ? (
                            <PositiveGrowthStat
                              final={dataSet[dataSet.length - 1].n}
                              start={dataSet[dataSet.length - 2].n}
                            ></PositiveGrowthStat>
                          ) : (
                            <NetralGrowthStat
                              final={dataSet[dataSet.length - 1].n}
                              start={dataSet[dataSet.length - 2].n}
                            ></NetralGrowthStat>
                          )}
                        </Flex>
                        <Metric>{dataSet[dataSet.length - 1].n} gr/m2</Metric>
                      </Card>

                      {/* P */}
                      <Card className="max-w-sm mt-1">
                        <Flex justifyContent="between" alignItems="center">
                          <Text>Petak {index + 1} (P)</Text>
                          {dataSet[dataSet.length - 1].p -
                            dataSet[dataSet.length - 2].p <
                          0 ? (
                            <NegativeGrowthStat
                              final={dataSet[dataSet.length - 1].p}
                              start={dataSet[dataSet.length - 2].p}
                            ></NegativeGrowthStat>
                          ) : dataSet[dataSet.length - 1].p -
                              dataSet[dataSet.length - 2].p >
                            0 ? (
                            <PositiveGrowthStat
                              final={dataSet[dataSet.length - 1].p}
                              start={dataSet[dataSet.length - 2].p}
                            ></PositiveGrowthStat>
                          ) : (
                            <NetralGrowthStat
                              final={dataSet[dataSet.length - 1].p}
                              start={dataSet[dataSet.length - 2].p}
                            ></NetralGrowthStat>
                          )}
                        </Flex>
                        <Metric>{dataSet[dataSet.length - 1].p} gr/m2</Metric>
                      </Card>
                      {/* k */}
                      <Card className="max-w-sm mt-1">
                        <Flex justifyContent="between" alignItems="center">
                          <Text>Petak {index + 1} (K)</Text>
                          {dataSet[dataSet.length - 1].k -
                            dataSet[dataSet.length - 2].k <
                          0 ? (
                            <NegativeGrowthStat
                              final={dataSet[dataSet.length - 1].k}
                              start={dataSet[dataSet.length - 2].k}
                            ></NegativeGrowthStat>
                          ) : dataSet[dataSet.length - 1].k -
                              dataSet[dataSet.length - 2].k >
                            0 ? (
                            <PositiveGrowthStat
                              final={dataSet[dataSet.length - 1].k}
                              start={dataSet[dataSet.length - 2].k}
                            ></PositiveGrowthStat>
                          ) : (
                            <NetralGrowthStat
                              final={dataSet[dataSet.length - 1].k}
                              start={dataSet[dataSet.length - 2].k}
                            ></NetralGrowthStat>
                          )}
                        </Flex>
                        <Metric>{dataSet[dataSet.length - 1].k} gr/m2</Metric>
                      </Card>
                    </Flex>

                    {/* Rekomendasi Card */}
                    <Flex justifyContent="start" className="flex flex-wrap flex-row gap-5 mt-3">
                      <Card className="w-fit mt-1">
                      <Text>Petak {rekomendationDosage[index].petak}</Text>
                      <Flex justifyContent="start" className="flex flex-wrap flex-row gap-5">
                        <div>
                            <Text>Rekomendasi Dosis N</Text>
                            <Metric className="">{rekomendationDosage[index].dosagerecomendationn} gram</Metric>
                          </div>
                          <div>
                          <Text>Rekomendasi Dosis P</Text>
                            <Metric className="">{rekomendationDosage[index].dosagerecomendationp} gram</Metric>
                          </div>
                          <div>
                          <Text>Rekomendasi Dosis K</Text>
                            <Metric className="">{rekomendationDosage[index].dosagerecomendationk} gram</Metric>
                          </div>
                      </Flex>
                        
                    </Card>
                  </Flex>

                    <Text className="mt-4">Growth History</Text>
                    <AreaChart
                      className="mt-2"
                      data={dataSet}
                      index="timestamp"
                      categories={["n", "p", "k"]}
                      colors={["emerald", "gray", "blue"]}
                      // valueFormatter={valueFormatter}
                      onValueChange={(v) => setChartVal(JSON.stringify(v))}
                      connectNulls={true}
                      yAxisWidth={40}
                      maxValue={30}
                      minValue={0}
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
                      <Bold>Value (gr/m2)</Bold>
                    </Text>
                  </Flex>
                  <BarList data={dataSet.data} className="mt-2" />
                </Card>
              ))}
            </Flex>
          </Card>

          <TabGroup>
            <TabList className="mt-8">
              <Tab>Petak 1</Tab>
              <Tab>Petak 2</Tab>
              <Tab>Petak 3</Tab>
              <Tab>Petak 4</Tab>
              <Tab>Petak 5</Tab>
            </TabList>
            <Title className="mt-4">
              Grafik Pemberian Dosis Pupuk
            </Title>
            <TabPanels>
            {/* <Text>{JSON.stringify(rekomenAll)}</Text> */}
              {rekomenAll.map((rekomen, index) => (
                <TabPanel>
                    {/* <Text>{JSON.stringify(rekomen.petak_data)}</Text> */}
                  
                    <AreaChart
                      className="mt-2"
                      data={rekomen.petak_data}
                      index="timestamp"
                      categories={["dosagerecomendationn", "dosagerecomendationp", "dosagerecomendationk"]}
                      colors={["emerald", "gray", "blue"]}
                      // valueFormatter={valueFormatter}
                      onValueChange={(v) => setChartVal(JSON.stringify(v))}
                      connectNulls={true}
                      yAxisWidth={40}
                      maxValue={30}
                      minValue={0}
                    />
              </TabPanel>
              ))}
            </TabPanels>
          </TabGroup>

          {/* REKOMEN TABLE */}
          <Text className="!text-black !mt-5">Rekomendasi Dosis Pemupukan Tiap Petak</Text>
          <Card className="w-full md:order-none !mt-1">
            <RekomenTable rekomenData={rekomendationDosage} />
          </Card>

          {/* REKOMENDASI */}
          {/* <Title>TODO</Title>
          <Title>
            MORE STATS - AVG, AVG OVER MONTH, MONTHLY USAGE, WEEKLY,{" "}
          </Title>

          <Card className="mt-5">
            <Title className="mb-2">Plot petak nilai NPK</Title>
            <Legend
              className="place-self-end mb-4"
              categories={["Tinggi", "Sedang", "Rendah"]}
              colors={["lime", "slate", "red"]}
            />

            {transformedData.map((dataSet, index) => (
              <div>
                <div>{JSON.stringify(dataSet)}</div>
              </div>
            ))}

            <div className="">
              <div className="grid grid-cols-3 grid-rows-2 gap-4">
                <div className="">1</div>
                <div className="">2</div>
                <div className="col-start-1 row-start-2">3</div>
                <div className="col-start-2 row-start-2">4</div>
                <div className="row-span-2 col-start-3 row-start-1">5</div>
              </div>
            </div>
          </Card> */}

          <Card className="mt-5">
            <Title className="mb-2">Plot petak nilai N</Title>
            <Legend
              className="place-self-end mb-4"
              categories={["Tinggi", "Sedang", "Rendah"]}
              colors={["red", "green", "blue"]}
            />
            <Flex justifyContent="start" className="grid grid-cols-5 gap-4">
              {dataSets.map((dataSet, index) => (
                <Card
                  className={`w-1/8 h-60 ${
                    dataSet.data[0]["value"] >= 24
                    ? "bg-red-400"
                    : dataSet.data[0]["value"] >= 8
                    ? "bg-lime-300"
                    : "bg-blue-300"
                  } `}
                >
                  <Title className="text-center">Petak Nomer {index + 1}</Title>
                  <Text className="text-center mt-10 text-2xl">
                    Nitrogen (N) : {dataSet.data[0]["value"]} gr/m2
                  </Text>
                </Card>
              ))}
            </Flex>
          </Card>

          <Card className="mt-5">
            <Title className="mb-2">Plot petak nilai P</Title>
            <Legend
              className="place-self-end mb-4"
              categories={["Tinggi", "Sedang", "Rendah"]}
              colors={["red", "green", "blue"]}
            />
            <Flex justifyContent="start" className="grid grid-cols-5 gap-4">
              {dataSets.map((dataSet, index) => (
                <Card
                  className={`w-1/8 h-60 ${
                    dataSet.data[1]["value"] >= 24
                    ? "bg-red-400"
                    : dataSet.data[1]["value"] >= 8
                    ? "bg-lime-300"
                    : "bg-blue-300"
                  } `}
                >
                  <Title className="text-center">Petak Nomer {index + 1}</Title>
                  <Text className="text-center mt-10 text-2xl">
                    Phosphat (P): {dataSet.data[1]["value"]} gr/m2
                  </Text>
                </Card>
              ))}
            </Flex>
          </Card>

          {/* Plot Petak K */}
          <Card className="mt-5">
            <Title className="mb-2">Plot petak nilai K</Title>
            <Legend
              className="place-self-end mb-4"
              categories={["Tinggi", "Sedang", "Rendah"]}
              colors={["red", "green", "blue"]}
            />
            <Flex justifyContent="start" className="grid grid-cols-5 gap-4">
              {dataSets.map((dataSet, index) => (
                <Card
                  className={`w-1/8 h-60 justify-content-center ${
                    dataSet.data[2]["value"] >= 24
                    ? "bg-red-400"
                    : dataSet.data[2]["value"] >= 8
                    ? "bg-lime-300"
                    : "bg-blue-300"
                  } `}
                >
                  <Title className="text-center">Petak Nomer {index + 1}</Title>
                  <Text className="text-center mt-10 text-2xl">
                     Kalium (K): {dataSet.data[2]["value"]} gr/m2
                  </Text>
                </Card>
              ))}
            </Flex>
          </Card>

          {/* Plot Petak P */}
          {/* <Card className="mt-5">
            <Title className="mb-2">Plot petak nilai P</Title>
            <Legend
              className="place-self-end mb-4"
              categories={["Tinggi", "Sedang", "Rendah"]}
              colors={["lime", "slate", "red"]}
            />
            <Flex justifyContent="start" className="grid grid-cols-5 gap-4">
              {dataSets.map((dataSet, index) => (
                <Card
                  className={`w-1/8 h-60 ${
                    dataSet.data[1]["value"] > 40
                      ? "bg-lime-500"
                      : dataSet.data[1]["value"] > 20
                      ? "bg-gray-200"
                      : "bg-red-500"
                  } `}
                >
                  <Title className="text-center">Petak Nomer {index + 1}</Title>
                  <Text className="text-center mt-10 text-2xl">
                    P: {dataSet.data[1]["value"]}
                  </Text>
                </Card>
              ))}
            </Flex>
          </Card> */}

          {/* Plot Petak L */}
          {/* <Card className="mt-5">
            <Title className="mb-2">Plot petak nilai K</Title>
            <Legend
              className="place-self-end mb-4"
              categories={["Tinggi", "Sedang", "Rendah"]}
              colors={["lime", "slate", "red"]}
            />
            <Flex justifyContent="start" className="grid grid-cols-5 gap-4">
              {dataSets.map((dataSet, index) => (
                <Card
                  className={`w-1/8 h-60 justify-content-center ${
                    dataSet.data[2]["value"] > 40
                      ? "bg-lime-500"
                      : dataSet.data[2]["value"] > 20
                      ? "bg-gray-200"
                      : "bg-red-500"
                  } `}
                >
                  <Title className="text-center">Petak Nomer {index + 1}</Title>
                  <Text className="text-center mt-10 text-2xl">
                    K: {dataSet.data[2]["value"]}
                  </Text>
                </Card>
              ))}
            </Flex>
          </Card> */}

          {/* Table All data */}
          <Text className="!text-black !mt-4">
            Data Hasil Pengambilan Sensor
          </Text>
          <Card className="w-full md:order-none !mt-1">
            <DataTable sensorData={allData} />
          </Card>

          {/* AVG Tabel Evaluasi */}
          <Card className="mt-5">
            <Title>Rerata Pertumbuhan Tanaman</Title>

            <Flex justifyContent="start" className="flex flex-wrap flex-row gap-5">
              {avgEval.map((stat, index) => (
                <Card className="max-w-sm mt-1">
                <Text>Petak {stat.petak}</Text>
                <Flex justifyContent="start" className="flex flex-wrap flex-row gap-5 mt-1">
                  <div>
                    <Text>Rerata Tinggi</Text>
                    <Metric className="">{Math.round(stat.tinggi_avg * 100) / 100} cm</Metric>
                  </div>
                  <div>
                    <Text>Rerata Lebar Daun</Text>
                    <Metric className="">{Math.round(stat.lebar_avg * 100) / 100} cm</Metric>
                  </div>
                </Flex>
              </Card>
              ))}
            </Flex>
          </Card>

          {/* Gambar */}
          <Card className="w-full md:order-none !mt-1">
            <Title>Kondisi Sawah Tiap Petak</Title>
            <Flex justifyContent="start" className="flex flex-wrap flex-row gap-5">
                <Card className="max-w-sm mt-1">
                  <Text>Petak 1</Text>
                  <img className="object-fill h-150 w-96" src="https://i.ibb.co/VQSnnrv/1700116673311.jpg" alt="1700116673311" border="0"></img>
                </Card>
                <Card className="max-w-sm mt-1">
                  <Text>Petak 2</Text>
                  <img className="object-fill h-150 w-96" src="https://i.ibb.co/VpNJCLG/1700116673317.jpg" alt="1700116673317" border="0"></img>
                </Card>
                <Card className="max-w-sm mt-1">
                  <Text>Petak 3</Text>
                  <img className="object-fill h-150 w-96" src="https://i.ibb.co/x5jwGjQ/1700116673326.jpg" alt="1700116673326" border="0"></img>
                </Card>
                <Card className="max-w-sm mt-1">
                  <Text>Petak 4</Text>
                  <img className="object-fill h-150 w-96" src="https://i.ibb.co/gFhcML2/1700116673333.jpg" alt="1700116673333" border="0"></img>
                </Card>
                <Card className="max-w-sm mt-1">
                  <Text>Petak 5</Text>
                  <img className="object-fill h-150 w-96" src="https://i.ibb.co/S393WGq/1700116673344.jpg" alt="1700116673344" border="0"></img>
                </Card>
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

          {/* Tabel Pemupukan */}
          <Text className="!text-black !mt-5">Data Pemupukan Tanaman</Text>
          <Card className="w-full md:order-none !mt-1">
            <PupukTable pupuk={pemupukan} />
          </Card>

          {/* Form Jumlah Pemupukan NPK */}
          <Text className="!text-black !mt-5">
            Form Pengiriman Data Pemupukan
          </Text>
          <Card className="w-full md:order-none !mt-1">
            <div className="">
              <form onSubmit={sendPupuk}>
                <div class="mb-6">
                  <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Hari Setelah Tanam (HST)
                  </label>
                  <input
                    type="text"
                    name="hst"
                    value={formPupuk.hst}
                    onChange={handlePupuk}
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
                    value={formPupuk.petak}
                    onChange={handlePupuk}
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="1"
                    required
                  />
                </div>
                <div class="mb-6">
                  <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Pemberian Pupuk Urea (gr)
                  </label>
                  <input
                    type="text"
                    name="dosisN"
                    value={formPupuk.dosisN}
                    onChange={handlePupuk}
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="1"
                    required
                  />
                </div>
                <div class="mb-6">
                  <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Pemberian Pupuk Phosphat (gr)
                  </label>
                  <input
                    type="text"
                    name="dosisP"
                    value={formPupuk.dosisP}
                    onChange={handlePupuk}
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="1"
                    required
                  />
                </div>
                <div class="mb-6">
                  <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Pemberian Pupuk Kalium (gr)
                  </label>
                  <input
                    type="text"
                    name="dosisK"
                    value={formPupuk.dosisK}
                    onChange={handlePupuk}
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
