import React, { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import "./App.css";

function App() {
  const [data, setdata] = useState();
  const [reqCount, setreqCount] = useState();
  const [departmentName, setdepartmentName] = useState();

  const fetchdata = async () => {
    try {
      const res = await fetch("https://checkinn.co/api/v1/int/requests");
      let result = await res.json()
      console.log(result)
      setreqCount(result.requests.length);

      setdepartmentName(() => {
        let name = result.requests.map((req) => {
         return req.desk.name
        });
        return name
      })

      let hotels = result.requests.map((req) => {
        return req.hotel.name;
      }); // getting hotels name object

      let hotelfrequency = {}; // storing hotels with req frequency
      for (let val of hotels) {
        hotelfrequency[val] = (hotelfrequency[val] || 0) + 1;
      }
      setdata({
        series: [
          {
            name: "Requests",
            data: Object.values(hotelfrequency),
          },
        ],
        options: {
          chart: {
            height: 350,
            type: "line",
            zoom: {
              enabled: false,
            },
            fontFamily: "Poppins",
          },
          dataLabels: {
            enabled: false,
          },
          stroke: {
            curve: "straight",
          },
          title: {
            text: "Request per hotels",
            align: "center",
            style: {
              fontSize: "22px",
              fontWeight: "bold",
              fontFamily: undefined,
              color: "#263238",
            },
          },
          grid: {
            row: {
              colors: ["#f3f3f3", "transparent"],
              opacity: 0.5,
            },
          },
          xaxis: {
            categories: Object.keys(hotelfrequency),
          },
        },
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchdata();
  }, []);

  return (
    <div className="chart-wrapper">
      {data && data.series && (
       <div className="chart">
         <Chart
          options={data.options}
          series={data.series}
          type="line"
          height={350}
          width={800}
        />
       </div>
      )}
      {reqCount && <h3>Total Request : {reqCount}</h3>}
      {departmentName && <p><span>List of Unique department names across all Hotels :</span>
        { departmentName.toString()}
      </p>}
    </div>
  );
}

export default App;
