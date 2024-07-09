import React from 'react';
import { Link } from 'react-router-dom';
import InfiniteScroll from 'react-infinite-scroll-component';
import './Accelerator21/AcceleratorDatasetIITKGP1.js'; 

class Accelerator2 extends React.Component {
    constructor() {
        super();
        this.state = {
            items: [],
            hasMore: true,
            search: '',
            page: 1,
        };
    }

    componentDidMount() {
        this.fetchData(1);
    }

    fetchData = (page) => {
        const newItems = [];
        // Generate new items with specific names for the first three items
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

    filteredItems() {
        const { items, search } = this.state;
        return items.filter(item => item.name.toLowerCase().includes(search.toLowerCase()));
    }

    render() {
        const { hasMore } = this.state;

        return (
            <div style={{ marginTop: '6%', position: 'relative' }}>
                <h1>Accelerator</h1>
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
                                <div style={{ marginLeft: 'auto' }}>
                                    {item.name === "Dataset 1" ? (
                                        <Link
                                            to={`/AcceleratorDatasetIITKGP1.js`}
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
            </div>
        );
    }
}

export default Accelerator2;
