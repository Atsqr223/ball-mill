import React, { useState, useCallback, useEffect } from 'react';
import { Button, Modal, Form } from 'react-bootstrap';
import { CSVLink } from 'react-csv'; // Import CSVLink for CSV download
import 'bootstrap/dist/css/bootstrap.min.css';

const FireButtons = () => {
  const [show, setShow] = useState(false);
  const [selectedButton, setSelectedButton] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [dataPoints, setDataPoints] = useState(''); // New state for number of data points
  const [logs, setLogs] = useState([]); // State to store logs
  const [hasMore, setHasMore] = useState(true); // To manage infinite scroll
  const [page, setPage] = useState(1); // Page state for infinite scroll

  const handleClose = () => setShow(false);
  const handleShow = (buttonName) => {
    setSelectedButton(buttonName);
    setShow(true);
  };

  const handleInputChange = (e) => setInputValue(e.target.value);

  const handleDataPointsChange = (e) => setDataPoints(e.target.value);

  const formatTimestamp = () => {
    const now = new Date();
    const month = now.toLocaleString('default', { month: 'long' });
    const weekNumber = Math.ceil(now.getDate() / 7);
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    return `${month}_${weekNumber}_${hours}_${minutes}`;
  };

  const handleSubmit = () => {
    const timestamp = formatTimestamp();
    const numPoints = parseInt(dataPoints, 10) || 1; // Default to 1 if invalid input
    const newLogs = Array.from({ length: numPoints }, () => `${inputValue}_${numPoints}_${timestamp}`);
    setLogs((prevLogs) => [...prevLogs, ...newLogs]); // Add multiple log entries
    setInputValue(''); // Clear the input field after submission
    setDataPoints(''); // Clear the data points field after submission
    handleClose(); // Close the modal after submission
  };

  const fetchMoreData = useCallback(() => {
    setTimeout(() => {
      if (logs.length >= 200) { // Limit the number of logs to 200
        setHasMore(false);
      } else {
        setPage(prevPage => prevPage + 1);
      }
    }, 1000);
  }, [logs]);

  useEffect(() => {
    if (page > 1) {
      fetchMoreData();
    }
  }, [page, fetchMoreData]);

  const buttonNames = ['Fire Radar', 'Fire Mic', 'Fire Accelerometer'];

  // Inline styles
  const styles = {
    buttonContainer: {
      marginTop: '5%',
      textAlign: 'center',
    },
    button: {
      width: '200px',
      height: '80px',
      fontSize: '20px',
      margin: '0 15px',
    },
    logContainer: {
      marginTop: '30px', // Added margin to create space between buttons and logs
      textAlign: 'center',
      maxWidth: '100%',
      margin: '0 auto',
      padding: '0 15px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      height: '80vh',
      overflowY: 'auto', // Added scrolling for long lists
    },
    logHeader: {
      width: '100%',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '10px',
    },
    logList: {
      listStyleType: 'none',
      padding: 0,
      margin: 0,
      width: '100%',
    },
    logItem: {
      background: '#ffffff',
      border: '1px solid #e0e0e0',
      borderRadius: '8px',
      padding: '15px',
      marginBottom: '10px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      fontSize: '16px',
      lineHeight: '1.5',
      textAlign: 'left',
      wordBreak: 'break-word',
      width: '100%',
    },
    downloadButton: {
      margin: '0',
    },
  };

  // Convert logs to CSV format
  const csvData = logs.map(log => [log]);

  return (
    <>
      <div style={styles.buttonContainer}>
        {/* Container for equidistant buttons */}
        <div className="container">
          <div className="row justify-content-center">
            {buttonNames.map((name, index) => (
              <div className="col-auto" key={index}>
                <Button
                  variant="danger"
                  style={styles.button}
                  onClick={() => handleShow(name)} // Show modal with button name
                >
                  {name}
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal Dialog */}
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{`Input for ${selectedButton}`}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formBasicText">
              <Form.Label>Enter your input:</Form.Label>
              <Form.Control
                type="text"
                placeholder="Type here..."
                value={inputValue}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="formDataPoints">
              <Form.Label>How many data points do you want to enter?</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter number"
                value={dataPoints}
                onChange={handleDataPointsChange}
                min="1"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            Submit
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Display logs below the buttons */}
      <div style={styles.logContainer}>
        <div style={styles.logHeader}>
          <h3>Log History:</h3>
          {/* Download CSV Button */}
          <CSVLink
            data={csvData}
            headers={[{ label: 'Log Entry', key: 'log' }]}
            filename={`log-history_${formatTimestamp()}.csv`} // Updated filename
            style={styles.downloadButton}
          >
            <Button variant="primary">Download CSV</Button>
          </CSVLink>
        </div>
        <ul style={styles.logList}>
          {logs.map((log, index) => (
            <li key={index} style={styles.logItem}>
              {log}
            </li>
          ))}
        </ul>
        {hasMore && (
          <div style={{ textAlign: 'center', padding: '10px' }}>
            <Button onClick={fetchMoreData}>Load More</Button>
          </div>
        )}
      </div>
    </>
  );
};

export default FireButtons;
