import React from 'react';
import { Link } from 'react-router-dom';
import InfiniteScroll from 'react-infinite-scroll-component';

class Radar1 extends React.Component {
    constructor() {
        super();
        this.state = {
            items: [],
            hasMore: true,
            search: '',
            page: 1,
            isDialogOpen: false,
            selectedItemId: null,
            numberOfSamples: ''
        };
    }

    componentDidMount() {
        this.fetchData(1);
    }

    fetchData = (page) => {
        const newItems = [];
        for (let i = 0; i < 100; i++) {
            let itemName;
            if (i === 0) {
                itemName = "Dataset 1";
            } else if (i === 1) {
                itemName = "Dataset 2";
            } else if (i === 2) {
                itemName = "Dataset 3";
            } else {
                itemName = `Item ${i + (page - 1) * 100}`;
            }
            newItems.push({ id: i, name: itemName });
        }
        if (page === 100) {
            this.setState({ hasMore: false });
        }
        this.setState({ items: [...this.state.items, ...newItems], page });
    };

    handleSearch = (e) => {
        this.setState({ search: e.target.value });
    };

    handleDialogClose = () => {
        this.setState({ isDialogOpen: false, numberOfSamples: '' });
    };

    handleNumberOfSamplesChange = (e) => {
        this.setState({ numberOfSamples: e.target.value });
    };

    handleSubmit = () => {
        const { selectedItemId, numberOfSamples } = this.state;
        console.log(`Firing script for item ${selectedItemId} with ${numberOfSamples} samples`);
        this.handleDialogClose();
    };

    filteredItems() {
        const { items, search } = this.state;
        return items.filter(item => item.name.toLowerCase().includes(search.toLowerCase()));
    }

    render() {
        const { hasMore, isDialogOpen, numberOfSamples } = this.state;

        return (
            <div style={{ marginTop: '5%', position: 'relative' }}>
                <h1>Radar</h1>
                <div style={{ position: 'sticky', top: 0, backgroundColor: 'white', zIndex: 1, padding: '10px', marginBottom: '20px' }}>
                    <input
                        type="text"
                        placeholder="Search..."
                        value={this.state.search}
                        onChange={this.handleSearch}
                        style={{ padding: '10px', width: '100%' }}
                    />
                </div>
                <div style={{ overflow: 'auto', maxHeight: '80vh' }}>
                    <InfiniteScroll
                        dataLength={this.filteredItems().length}
                        next={() => this.fetchData(this.state.page + 1)}
                        hasMore={hasMore}
                        loader={<h4>Loading...</h4>}
                        endMessage={
                            <p style={{ textAlign: 'center' }}>
                                <b>You have seen it all.</b>
                            </p>
                        }
                    >
                        {this.filteredItems().map((item, index) => (
                            <div key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px', borderBottom: '1px solid #ccc' }}>
                                <span>{item.name}</span>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    {item.name === "Dataset 1" ? (
                                        <Link
                                            to={`/RadarDatasetTCSRI1.js`}
                                            style={{ marginLeft: '20px' }}
                                        >
                                            View details
                                        </Link>
                                    ) : item.name === "Dataset 2" ? (
                                        <Link
                                            to={`/RadarDatasetTCSRI2.js`}
                                            style={{ marginLeft: '20px' }}
                                        >
                                            View details
                                        </Link>
                                    ) : (
                                        <button
                                            style={{ marginLeft: '20px' }}
                                            onClick={() => window.location.href = `/details/${item.id}`}
                                        >
                                            View details
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </InfiniteScroll>
                </div>

                {/* Dialog */}
                {isDialogOpen && (
                    <div style={{
                        position: 'fixed',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        backgroundColor: 'white',
                        padding: '20px',
                        borderRadius: '5px',
                        boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
                        zIndex: 1000
                    }}>
                        <h2>Enter Number of Samples</h2>
                        <input
                            type="number"
                            value={numberOfSamples}
                            onChange={this.handleNumberOfSamplesChange}
                            style={{ padding: '10px', width: '100%' }}
                        />
                        <div style={{ marginTop: '10px', textAlign: 'right' }}>
                            <button
                                onClick={this.handleSubmit}
                                style={{ marginRight: '10px' }}
                            >
                                Submit
                            </button>
                            <button onClick={this.handleDialogClose}>
                                Cancel
                            </button>
                        </div>
                    </div>
                )}
            </div>
        );
    }
}

export default Radar1;
