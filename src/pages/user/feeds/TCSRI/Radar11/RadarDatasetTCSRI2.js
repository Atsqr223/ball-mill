import React, { useEffect, useState } from 'react';
import Plot from 'react-plotly.js';
import axios from 'axios';
import exampleData from './exampleData'; // Adjust the path as per your project structure
import exampleDataFFT from './exampleDataFFT'; // Adjust the path for FFT data
import { collection, getDocs } from 'firebase/firestore';
import db from '../../../../../components/firebase.js'; // Adjust the path as per your project structure
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import FFT from 'fft.js'; // Import FFT library

const RadarDatasetTCSRI2 = () => {
  // State for Radar Dataset
  const [radarData, setRadarData] = useState(null);

  // State for Accelerator Dataset
  const [acceleratorData, setAcceleratorData] = useState([]);
  const [secondAcceleratorData, setSecondAcceleratorData] = useState([]);

  // State for Firebase Data
  const [firebaseData, setFirebaseData] = useState([]);
  const [totalSamples, setTotalSamples] = useState(0); // New state for total samples

  // State for FFT Data
  const [fftData, setFFTData] = useState({ frequencies: [], amplitudes: [] });

  // State for Dialog
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [numberOfSamples, setNumberOfSamples] = useState(''); // Editable field
  const [selectedItemId, setSelectedItemId] = useState(null);

  // Effect for Radar Dataset
  useEffect(() => {
    const fetchRadarData = async () => {
      try {
        const response = await axios.get('https://ball-mill-flask.onrender.com/api/data');
        console.log('Response data:', response.data); // Verify the structure of the response
        setRadarData({
          x: response.data.x,
          y: response.data.y,
          z: response.data.z
        });
      } catch (error) {   
        console.error('Error fetching radar data:', error);
      }
    };

    fetchRadarData();
  }, []);

  // Effect for Accelerator Dataset (simulated with exampleData)
  useEffect(() => {
    // Simulating asynchronous data fetching (replace with actual data fetching code)
    setTimeout(() => {
      setAcceleratorData(exampleData); // Set acceleratorData to exampleData

      // Simulate fetching a second dataset
      setSecondAcceleratorData(exampleData.map(data => ({
        ...data,
        cpuUsage: data.cpuUsage * 1.2 // Just an example transformation
      })));
    }, 1000); // Adjust delay as needed
  }, []);

  // Fetch Data from Firebase
  const fetchDataFromFirebase = async (numSamples) => {
    try {
      const querySnapshot = await getDocs(collection(db, 'samples'));
      let data = querySnapshot.docs.map(doc => doc.data());
      
      // Limit the number of samples to the requested amount
      data = data.slice(0, numSamples);

      console.log('Firebase Data:', data); // Add this line
      setFirebaseData(data);
      setTotalSamples(data.length); // Update total samples count
      computeFFTFromFirebase(data); // Compute FFT after fetching Firebase data
    } catch (error) {
      console.error("Error fetching Firestore data: ", error);
    }
  };

  // Effect for Firebase Data - Load initial data
  useEffect(() => {
    fetchDataFromFirebase(totalSamples);
  }, [totalSamples]); // Trigger when totalSamples changes

  // Generate cylinder surface data for Radar plot
  const generateCylinderData = (radius, length) => {
    const theta = new Array(100).fill().map((_, i) => i * 2 * Math.PI / 100);
    const x = new Array(100).fill().map((_, i) => -length / 2 + (length * i) / 99); // Adjusted length calculation

    // Initialize arrays for surface data
    const surfaceX = [];
    const surfaceY = [];
    const surfaceZ = [];

    // Generate points for the cylinder surface
    for (let i = 0; i < 100; i++) {
      const currentX = x[i];
      const rowX = [];
      const rowY = [];
      const rowZ = [];

      for (let j = 0; j < 100; j++) {
        const angle = j * 2 * Math.PI / 100;
        const newX = currentX;
        const newY = radius * Math.cos(angle);
        const newZ = radius * Math.sin(angle);

        rowX.push(newX);
        rowY.push(newY);
        rowZ.push(newZ);
      }

      surfaceX.push(rowX);
      surfaceY.push(rowY);
      surfaceZ.push(rowZ);
    }

    // Add faces of the cylinder to cover the sides
    surfaceX.push([...surfaceX[0]]);
    surfaceY.push([...surfaceY[0]]);
    surfaceZ.push([...surfaceZ[0]]);

    return {
      type: 'surface',
      x: surfaceX,
      y: surfaceY,
      z: surfaceZ,
      opacity: 0.4,
      colorscale: 'Blues'
    };
  };

  // Radar plot data
  const radarPlotData = {
    data: radarData ? [
      {
        type: 'scatter3d',
        mode: 'markers',
        x: radarData.x,
        y: radarData.y,
        z: radarData.z,
        marker: {
          size: 5,
          color: 'green',
          opacity: 0.5              
        }
      },
      generateCylinderData(21, 40) // Adjust radius and length as needed
    ] : null,
    layout: {
      scene: {
        xaxis: { range: [-24, 24] },  // Adjust ranges based on your data
        yaxis: { range: [-25, 25] },
        zaxis: { range: [-25, 25] },
        aspectmode: 'manual',
        aspectratio: { x: 1, y: 1, z: 1 }
      },
      width: '100%',
      height: '100%'
    }
  };

  // Active Time Series Data (line plot)
  let xData = [];
  let yData = [];
  let yData2 = [];

  if (firebaseData.length > 0) {
    xData = firebaseData.map(data => new Date(data.Time_Stamp1)); // Assuming Time_Stamp1 is the x-axis data
    yData = firebaseData.map(data => data.Sample1_data); // Sample1_data for y-axis
    yData2 = firebaseData.map(data => data.Sample2_data); // Sample2_data for second y-axis
  }

  const linePlotData = {
    data: [
      {
        type: 'scatter',
        mode: 'markers',
        x: xData,
        y: yData,
        name: 'Sample1 Data',
        marker: { color: 'green' },
      },
      {
        type: 'scatter',
        mode: 'markers',
        x: xData,
        y: yData2,
        name: 'Sample2 Data',
        marker: { color: 'blue' },
      },
    ],
    layout: {
      title: 'Active Time Series Data',
      xaxis: {
        title: 'Time',
        type: 'date', // This ensures Plotly treats x-axis as date/time
      },
      yaxis: {
        title: 'Sample Data',
      },
      width: '50%',
      height: '100%',
    }
  };

  const filledAreaPlotData = {
    data: [
      {
        type: 'markers',
        mode: 'lines',
        x: xData,
        y: yData,
        fill: 'tozeroy', // Fill to x-axis
        fillcolor: 'rgba(0,100,80,0.2)', // Color for the filled area
        line: { color: 'transparent' }, // Hide line for filled area plot
      },
    ],
    layout: {
      title: 'Area Under the Curve',
      xaxis: {
        title: 'Time',
        type: 'date', // This ensures Plotly treats x-axis as date/time
      },
      yaxis: {
        title: 'CPU Usage',
      },
      width: 800,
      height: 400,
    }
  };

  // FFT plot data
  const fftPlotData = {
    data: [
      {
        type: 'scatter',
        mode: 'lines',
        x: fftData.frequencies,
        y: fftData.amplitudes,
        line: { color: 'blue' }
      }
    ],
    layout: {
      title: 'FFT Plot',
      xaxis: {
        title: 'Frequency',
        type: 'linear', // Linear scale for frequency axis
      },
      yaxis: {
        title: 'Amplitude',
      },
      width: 800,
      height: 400,
    }
  };

  // FFT function implementation using fft.js
  const fft = require('fft-js').fft;

  const performFFT = (dataPoints) => {
    // Check if the length of dataPoints is a power of two and greater than one
    const n = dataPoints.length;
    if ((n & (n - 1)) !== 0 || n <= 1) {
      // If not a power of two or less than 2, pad or truncate dataPoints
      const paddedLength = Math.pow(2, Math.ceil(Math.log2(n))); // Next power of two
      dataPoints = dataPoints.slice(0, paddedLength).concat(new Array(paddedLength - n).fill(0)); // Truncate or pad with zeros
    }
  
    // Perform FFT computation
    const result = fft(dataPoints);
  
    // Extract frequencies and amplitudes
    const frequencies = [];
    const amplitudes = [];
    for (let i = 0; i < result.length; i++) {
      const magnitude = Math.sqrt(result[i][0] ** 2 + result[i][1] ** 2);
      const frequency = i; // Index represents frequency
      frequencies.push(frequency);
      amplitudes.push(magnitude);
    }
  
    return { frequencies, amplitudes };
  };

  // Compute FFT from Firebase data
  const computeFFTFromFirebase = (data) => {
    if (data.length > 0) {
      const dataPoints = data.map(data => data.Sample1_data); // Use Sample1_data for FFT computation
      console.log('Data Points for FFT:', dataPoints); // Add this line
      const fftResult = performFFT(dataPoints);
      console.log('FFT Result:', fftResult); // Add this line
      setFFTData({ frequencies: fftResult.frequencies, amplitudes: fftResult.amplitudes });
    }
  };

  // Handle Dialog Interaction
  const handleDialogOpen = () => {
    setNumberOfSamples(totalSamples); // Pre-fill dialog with current number of samples
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
  };

  const handleFireButtonClick = () => {
    // Handle Fire button click logic
    const numSamples = parseInt(numberOfSamples, 10);
    if (!isNaN(numSamples) && numSamples > 0) {
      setTotalSamples(numSamples); // Update totalSamples to trigger data fetch
    } else {
      alert("Please enter a valid number of samples.");
    }
    handleDialogClose();
  };

  const handleNumberOfSamplesChange = (e) => {
    setNumberOfSamples(e.target.value); // Update the state as user types
  };

  return (
    <div className="container-fluid py-4">
      <h1 className="text-center mb-4">Radar Data from TCS Kolkata Office</h1>

      <button onClick={handleDialogOpen} className="btn btn-primary mb-4">Open Fire Dialog</button>

      {isDialogOpen && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Enter Number of Samples</h5>
                <button type="button" className="close" onClick={handleDialogClose}>
                  <span>&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <input 
                  type="text" 
                  value={numberOfSamples}
                  onChange={handleNumberOfSamplesChange} // Handle input change
                  className="form-control"
                  placeholder="Enter number of samples"
                />
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-primary" onClick={handleFireButtonClick}>Fire</button>
                <button type="button" className="btn btn-secondary" onClick={handleDialogClose}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="row justify-content-center">
        <div className="col-lg-8 col-md-10">
          <div className="card mb-4">
            <div className="card-body">
              <h2 className="card-title">3D Radar Plot</h2>
              <div className="plot-container">
                {radarPlotData.data ? (
                  <Plot
                    data={radarPlotData.data}
                    layout={radarPlotData.layout}
                  />
                ) : (
                  <p>Loading 3D interactive plot...</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row justify-content-center">
        <div className="col-lg-8 col-md-10">
          <div className="card mb-4">
            <div className="card-body">
              <h2 className="card-title">Active Time Series Data</h2>
              <div className="plot-container">
                {firebaseData.length > 0 ? (
                  <Plot
                    data={linePlotData.data}
                    layout={linePlotData.layout}
                  />
                ) : (
                  <p>Loading Time Series Data...</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row justify-content-center">
        <div className="col-lg-8 col-md-10">
          <div className="card mb-4">
            <div className="card-body">
              <h2 className="card-title">Area Under the Curve</h2>
              <div className="plot-container">
                {firebaseData.length > 0 ? (
                  <Plot
                    data={filledAreaPlotData.data}
                    layout={filledAreaPlotData.layout}
                  />
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row justify-content-center">
        <div className="col-lg-8 col-md-10">
          <div className="card mb-4">
            <div className="card-body">
              <h2 className="card-title">Fast Fourier Transform (FFT)</h2>
              <div className="plot-container">
                <Plot
                  data={fftPlotData.data}
                  layout={fftPlotData.layout}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row justify-content-center">
        <div className="col-lg-8 col-md-10">
          <div className="card mb-4">
            <div className="card-body">
              <h2 className="card-title">Firebase Data Plot</h2>
              <div className="plot-container">
                {firebaseData.length > 0 ? (
                  <Plot
                    data={[
                      {
                        type: 'scatter',
                        mode: 'markers',
                        x: firebaseData.map(data => new Date(data.Time_Stamp1)),
                        y: firebaseData.map(data => data.Sample1_data),
                        name: 'Sample1 Data',
                        marker: { color: 'green' },
                      },
                      {
                        type: 'scatter',
                        mode: 'markers',
                        x: firebaseData.map(data => new Date(data.Time_Stamp2)),
                        y: firebaseData.map(data => data.Sample2_data),
                        name: 'Sample2 Data',
                        marker: { color: 'blue' },
                      },
                    ]}
                    layout={{
                      title: 'Sample Data from Firebase',
                      xaxis: {
                        title: 'Time',
                        type: 'date', // This ensures Plotly treats x-axis as date/time
                      },
                      yaxis: {
                        title: 'Sample Data',
                      },
                      width: 800,
                      height: 600,
                    }}
                  />
                ) : (
                  <p>Loading Firebase Data...</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RadarDatasetTCSRI2;
