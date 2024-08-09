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
  const [radarData, setRadarData] = useState(null);
  const [acceleratorData, setAcceleratorData] = useState([]);
  const [secondAcceleratorData, setSecondAcceleratorData] = useState([]);
  const [firebaseData, setFirebaseData] = useState([]);
  const [totalSamples, setTotalSamples] = useState(0);
  const [fftData, setFFTData] = useState({ frequencies: [], amplitudes: [] });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [numberOfSamples, setNumberOfSamples] = useState('');
  const [selectedRadar, setSelectedRadar] = useState('All Sensors'); // New state for selected radar

  useEffect(() => {
    const fetchRadarData = async () => {
      try {
        const response = await axios.get('https://ball-mill-flask.onrender.com/api/data');
        console.log('Response data:', response.data);
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

  useEffect(() => {
    setTimeout(() => {
      setAcceleratorData(exampleData);
      setSecondAcceleratorData(exampleData.map(data => ({
        ...data,
        cpuUsage: data.cpuUsage * 1.2
      })));
    }, 1000);
  }, []);

  const fetchDataFromFirebase = async (numSamples) => {
    try {
      const querySnapshot = await getDocs(collection(db, 'samples'));
      let data = querySnapshot.docs.map(doc => doc.data());
      data = data.slice(0, numSamples);

      console.log('Firebase Data:', data);
      setFirebaseData(data);
      setTotalSamples(data.length);
      computeFFTFromFirebase(data);
    } catch (error) {
      console.error("Error fetching Firestore data: ", error);
    }
  };

  useEffect(() => {
    fetchDataFromFirebase(totalSamples);
  }, [totalSamples]);

  const generateCylinderData = (radius, length) => {
    const theta = new Array(100).fill().map((_, i) => i * 2 * Math.PI / 100);
    const x = new Array(100).fill().map((_, i) => -length / 2 + (length * i) / 99);

    const surfaceX = [];
    const surfaceY = [];
    const surfaceZ = [];

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
      generateCylinderData(21, 40)
    ] : null,
    layout: {
      scene: {
        xaxis: { range: [-24, 24] },
        yaxis: { range: [-25, 25] },
        zaxis: { range: [-25, 25] },
        aspectmode: 'manual',
        aspectratio: { x: 1, y: 1, z: 1 }
      },
      width: '100%',
      height: '100%'
    }
  };

  let xData = [];
  let yData = [];
  let yData2 = [];

  if (firebaseData.length > 0) {
    xData = firebaseData.map(data => new Date(data.Time_Stamp1));
    yData = firebaseData.map(data => data.Sample1_data);
    yData2 = firebaseData.map(data => data.Sample2_data);
  }

  const linePlotData = {
    data: selectedRadar === 'Radar 1' || selectedRadar === 'All Sensors' ? [
      {
        type: 'scatter',
        mode: 'markers',
        x: xData,
        y: yData,
        name: 'Radar 1 Data',
        marker: { color: 'green' },
      },
    ] : [],
    layout: {
      title: 'Active Time Series Data',
      xaxis: {
        title: 'Time',
        type: 'date',
      },
      yaxis: {
        title: 'Sample Data',
      },
      width: '50%',
      height: '100%',
    }
  };

  if (selectedRadar === 'Radar 2' || selectedRadar === 'All Sensors') {
    linePlotData.data.push({
      type: 'scatter',
      mode: 'markers',
      x: xData,
      y: yData2,
      name: 'Radar 2 Data',
      marker: { color: 'blue' },
    });
  }

  const filledAreaPlotData = {
    data: selectedRadar === 'Radar 1' || selectedRadar === 'All Sensors' ? [
      {
        type: 'markers',
        mode: 'lines',
        x: xData,
        y: yData,
        fill: 'tozeroy',
        fillcolor: 'rgba(0,100,80,0.2)',
        line: { color: 'transparent' },
      },
    ] : [],
    layout: {
      title: 'Area Under the Curve',
      xaxis: {
        title: 'Time',
        type: 'date',
      },
      yaxis: {
        title: 'CPU Usage',
      },
      width: 800,
      height: 400,
    }
  };

  if (selectedRadar === 'Radar 2' || selectedRadar === 'All Sensors') {
    filledAreaPlotData.data.push({
      type: 'markers',
      mode: 'lines',
      x: xData,
      y: yData2,
      fill: 'tozeroy',
      fillcolor: 'rgba(0,100,80,0.2)',
      line: { color: 'transparent' },
    });
  }

  const fftPlotData = {
    data: selectedRadar === 'Radar 1' || selectedRadar === 'All Sensors' ? [
      {
        type: 'scatter',
        mode: 'lines',
        x: fftData.frequencies,
        y: fftData.amplitudes1,
        line: { color: 'green' },
        name: 'Radar 1 FFT',
      },
    ] : [],
    layout: {
      title: 'FFT Plot',
      xaxis: {
        title: 'Frequency',
        type: 'linear',
      },
      yaxis: {
        title: 'Amplitude',
      },
      width: 800,
      height: 400,
    }
  };

  if (selectedRadar === 'Radar 2' || selectedRadar === 'All Sensors') {
    fftPlotData.data.push({
      type: 'scatter',
      mode: 'lines',
      x: fftData.frequencies,
      y: fftData.amplitudes2,
      line: { color: 'blue' },
      name: 'Radar 2 FFT',
    });
  }

  const fft = require('fft-js').fft;

  const performFFT = (dataPoints) => {
    const n = dataPoints.length;
    if ((n & (n - 1)) !== 0 || n <= 1) {
      const paddedLength = Math.pow(2, Math.ceil(Math.log2(n)));
      dataPoints = dataPoints.slice(0, paddedLength).concat(new Array(paddedLength - n).fill(0));
    }

    const result = fft(dataPoints);

    const frequencies = [];
    const amplitudes = [];
    const samplingRate = 1000;
    for (let i = 0; i < result.length / 2; i++) {
      const freq = (i * samplingRate) / result.length;
      const amp = Math.sqrt(result[i][0] ** 2 + result[i][1] ** 2);
      frequencies.push(freq);
      amplitudes.push(amp);
    }

    return { frequencies, amplitudes };
  };

  const computeFFTFromFirebase = (data) => {
    const data1 = data.map(d => d.Sample1_data);
    const data2 = data.map(d => d.Sample2_data);

    const fftData1 = performFFT(data1);
    const fftData2 = performFFT(data2);

    setFFTData({
      frequencies: fftData1.frequencies,
      amplitudes1: fftData1.amplitudes,
      amplitudes2: fftData2.amplitudes,
    });
  };

  return (
    <div className="container mt-5 d-flex flex-column align-items-center">
    <div style={{ marginTop: '5%' }}>
      <h1 className="mb-4">Radar and Sensor Data Dashboard</h1>
      <button className="btn btn-primary mb-4" onClick={() => setIsDialogOpen(true)}>Customize Number of Samples</button>
      {isDialogOpen && (
        <div className="modal fade show d-block" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">Customize Settings</h5>
                <button type="button" className="close" onClick={() => setIsDialogOpen(false)}>
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Number of Samples:</label>
                  <input
                    type="text"
                    className="form-control"
                    value={numberOfSamples}
                    onChange={(e) => setNumberOfSamples(e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Select Radar Data:</label>
                  <select className="form-select" value={selectedRadar} onChange={(e) => setSelectedRadar(e.target.value)}>
                    <option value="Radar 1">Radar 1</option>
                    <option value="Radar 2">Radar 2</option>
                    <option value="All Sensors">All Sensors</option>
                  </select>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-success" onClick={() => {
                  setTotalSamples(numberOfSamples);
                  setIsDialogOpen(false);
                }}>Update</button>
                <button type="button" className="btn btn-secondary" onClick={() => setIsDialogOpen(false)}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="card p-4 mb-4 w-100 d-flex align-items-center">
        <Plot {...radarPlotData} />
      </div>
      <div className="card p-4 mb-4 w-100 d-flex align-items-center">
        <Plot {...linePlotData} />
      </div>
      <div className="card p-4 mb-4 w-100 d-flex align-items-center">
        <Plot {...filledAreaPlotData} />
      </div>
      <div className="card p-4 mb-4 w-100 d-flex align-items-center">
        <Plot {...fftPlotData} />

      </div>
    </div>
    </div>
  );
};

export default RadarDatasetTCSRI2;
