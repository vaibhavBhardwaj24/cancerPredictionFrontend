import { useEffect, useState, useCallback } from "react";
import "./App.css";
import axios from "axios";
import Plot from "react-plotly.js";
import "@fontsource/source-code-pro"; // Defaults to weight 400 with all styles included.
import "@fontsource/rajdhani";
import { PieChart, Pie, Tooltip, Legend, Cell } from "recharts";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis } from "recharts";
function App() {
  const [prediction, setPrediction] = useState(null);
  const [probablity, setProbablity] = useState(0.5);
  const [graph, setGraph] = useState([]);
  const initialValues = {
    radius_mean: 14.127292,
    texture_mean: 19.289649,
    perimeter_mean: 91.969033,
    area_mean: 654.889104,
    smoothness_mean: 0.09636,
    compactness_mean: 0.104341,
    concavity_mean: 0.088799,
    points_mean: 0.048919,
    symmetry_mean: 0.181162,
    dimension_mean: 0.062798,
    radius_se: 0.405172,
    texture_se: 1.216853,
    perimeter_se: 2.866059,
    area_se: 40.337079,
    smoothness_se: 0.007041,
    compactness_se: 0.025478,
    concavity_se: 0.031894,
    points_se: 0.011796,
    symmetry_se: 0.020542,
    dimension_se: 0.003795,
    radius_worst: 16.26919,
    texture_worst: 25.677223,
    perimeter_worst: 107.261213,
    area_worst: 880.583128,
    smoothness_worst: 0.132369,
    compactness_worst: 0.254265,
    concavity_worst: 0.272188,
    points_worst: 0.114606,
    symmetry_worst: 0.290076,
    dimension_worst: 0.083946,
  };

  const mavValues = {
    radius_mean: 28.11,
    texture_mean: 39.28,
    perimeter_mean: 188.5,
    area_mean: 2501.0,
    smoothness_mean: 0.1634,
    compactness_mean: 0.3454,
    concavity_mean: 0.4268,
    points_mean: 0.2012,
    symmetry_mean: 0.304,
    dimension_mean: 0.09744,
    radius_se: 2.873,
    texture_se: 4.885,
    perimeter_se: 21.98,
    area_se: 542.2,
    smoothness_se: 0.03113,
    compactness_se: 0.1354,
    concavity_se: 0.396,
    points_se: 0.05279,
    symmetry_se: 0.07895,
    dimension_se: 0.02984,
    radius_worst: 36.04,
    texture_worst: 49.54,
    perimeter_worst: 251.2,
    area_worst: 4254.0,
    smoothness_worst: 0.2226,
    compactness_worst: 1.058,
    concavity_worst: 1.252,
    points_worst: 0.291,
    symmetry_worst: 0.6638,
    dimension_worst: 0.2075,
  };

  const [values, setValues] = useState(initialValues);
  const [loading, setLoading] = useState(true);
  const scaledValue = probablity * 100;
  const intValue = parseFloat(scaledValue.toFixed(4)); // Convert to a number with 4 decimal places

  const data = [
    { name: "Benign", value: intValue },
    { name: "Malignant", value: intValue === 0 ? 0 : 100 - intValue },
  ];

  const COLORS = [
    "rgba(255, 0, 0, 0.8)", // Red with 60% opacity
    "rgba(0, 0, 255, 0.7)", // Blue with 60% opacity
  ];
  const handleChange = (feature, newValue) => {
    setValues((prevValues) => ({
      ...prevValues,
      [feature]: newValue,
    }));
    // console.log(feature, newValue);
  };
  const predict = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.post(
        "https://d272-182-69-177-158.ngrok-free.app/api/prediction",
        values
      );
      const graphResponse = await axios.post(
        "https://d272-182-69-177-158.ngrok-free.app/api/graph",
        values
      );

      setGraph(graphResponse.data);
      setProbablity(res.data.probabilities[0][0]);
      setPrediction(res.data.predictions[0]);
    } catch (error) {
      console.error("Error during prediction:", error);
    }
    setLoading(false);
  }, [values]);
  useEffect(() => {
    predict();
  }, []);
  return (
    <div className="flex w-full h-screen font-rajdhani ">
      {/* Left Section: Scrollable */}
      <div className="w-1/3 h-full bg-black/5 overflow-y-auto p-4">
        <div className="pb-20">
          <h1 className="text-3xl  font-bold">Cell Nuclei Measurement</h1>
          <button
            onClick={() => predict()}
            className="mb-4 px-4 py-2 bg-blue-500 text-white rounded"
            disabled={loading}
          >
            {loading ? "loading.." : "Predict"}
          </button>
        </div>
        {Object.keys(initialValues).map((feature) => (
          <div key={feature} className="mb-5">
            <label
              htmlFor={feature}
              className="text-2xl mb-2 w-full font-bold justify-between flex"
            >
              {typeof feature === "string"
                ? feature.replace(/_/g, " ")
                : feature}
              :{" "}
              <div className="text-sm  font-source-code-pro">
                <input
                  type="text"
                  inputMode="decimal"
                  className="w-20 px-2 flex items-center rounded-md m-2 focus:outline-none text-blue-700 bg-blue-500/50 "
                  value={parseFloat(values[feature].toFixed(4))}
                  onChange={(e) =>
                    handleChange(feature, parseFloat(e.target.value))
                  }
                />
              </div>
            </label>

            <input
              type="range"
              id={feature}
              name={feature}
              min={0.0}
              max={mavValues[feature]}
              step={(mavValues[feature] - initialValues[feature]) / 1000}
              value={values[feature]}
              onChange={(e) =>
                handleChange(feature, parseFloat(e.target.value))
              }
              className="w-full "
              // style={{ font: Roboto }}
            />

            {/* {console.log(mavValues[i])} */}
          </div>
        ))}
      </div>

      <div className="w-2/3 p-4 h-full overflow-y-auto ">
        <div className="w-full justify-between flex ">
          <p className="w-1/3 p-2 text-lg">
            Enter your cytology records to quickly determine the type of cancer
            you may have. Our advanced machine learning model analyzes your data
            and provides an accurate prediction.
          </p>
          <div>
            <div className="text-6xl pr-1 font-bold">
              {prediction === 0 ? (
                <span className="text-green-500 ">Benign</span>
              ) : (
                <span className="text-red-500">Malignant</span>
              )}
            </div>
            <h1 className="text-2xl  gap-2">
              Probabilty of Cancer being
              <p>
                Benign{"         "}
                <span className="bg-green-500/50 text-green-600 border-[1px] border-green-700 rounded-lg font-source-code-pro px-2 w-fit">
                  {intValue}%
                </span>
              </p>
              <p>
                Malignant{"   "}
                <span className="bg-red-500/50 text-red-600 border-[1px] border-red-700 rounded-lg font-source-code-pro px-2">
                  {parseFloat((100 - intValue).toFixed(4))}%
                </span>
              </p>
            </h1>
          </div>
        </div>
        <div className="mt-4 flex  w-full justify-center items-center flex-col-reverse">
          <div>
            <Plot
              data={graph.data}
              layout={{
                ...graph.layout,
                width: 800, // Adjust width as needed
                height: 600, // Adjust height as needed
              }}
            />
          </div>
          <PieChart width={500} height={500} key={JSON.stringify(data)}>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              outerRadius={200}
              fill="#8884d8"
              label
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
          {/* <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value">
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer> */}
        </div>
      </div>
    </div>
  );
}

export default App;
