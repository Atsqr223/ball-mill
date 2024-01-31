import React, { useState, useEffect } from 'react';

export default function Table(props) {

    const [userList, setUserList] = useState([]);
    const [editUserData, setEditUserData] = useState({});

    useEffect(() => {
        setEditUserData(props.editUserData);
        setUserList(props.userList);
    }, [props])

    return <table className='table'>
        <thead>
            <tr>
                <td>Name</td>
                <td>Email</td>
                <td>City</td>
                <td>Username</td>
                <td>Company</td>
                <td>Option</td>
            </tr>
        </thead>

        <tbody>
            {userList.length > 0 ?
                userList.map((user, index) => {
                    return (<tr key={index}>
                        {user.edit == true ? <>
                            <td>
                                <input type='text' value={editUserData.name} onChange={(e) => {
                                    setEditUserData({
                                        ...editUserData, // copy the current properties of "json"
                                        name: e.target.value // update the "name" property
                                    });
                                }} />
                            </td>
                            <td>
                                <input type='text' value={editUserData.email} onChange={(e) => {
                                    setEditUserData({
                                        ...editUserData, // copy the current properties of "json"
                                        email: e.target.value // update the "name" property
                                    });
                                }} />
                            </td>
                            <td><input type='text' value={editUserData?.address?.city} onChange={(e) => {
                                let address = editUserData.address;
                                setEditUserData({
                                    ...editUserData, // copy the current properties of "json"
                                    address: {
                                        ...address, // copy the current properties of "json"
                                        city: e.target.value // update the "name" property
                                    }
                                });
                            }} /></td>
                            <td>
                                <input type='text' value={editUserData.username} onChange={(e) => {
                                    setEditUserData({
                                        ...editUserData, // copy the current properties of "json"
                                        username: e.target.value // update the "name" property
                                    });
                                }} />
                            </td>
                            <td><input type='text' value={editUserData?.company?.name} onChange={(e) => {
                                let company = editUserData.company;
                                setEditUserData({
                                    ...editUserData, // copy the current properties of "json"
                                    company: {
                                        ...company, // copy the current properties of "json"
                                        name: e.target.value // update the "name" property
                                    }
                                });
                            }} /></td>
                            <td>
                                <button type='button' onClick={(e) => { props.updateUser(user, editUserData) }}>Update</button>
                                <button type='button' onClick={(e) => {
                                    setUserList((userList) => userList.map((u) => {
                                        if (u === user) {
                                            return { ...u, edit: false };
                                        }
                                        return u;
                                    }))
                                }}>Cancel</button>
                            </td>
                        </> : <>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            <td>{user.address.city}</td>
                            <td>{user.username}</td>
                            <td>{user.company.name}</td>
                            <td>
                                <button type='button' onClick={(e) => { props.deleteUser(user) }}>Delete</button>
                                <button type='button' onClick={(e) => { props.editUser(user) }}>Edit</button>
                            </td>
                        </>}
                    </tr>)
                }) :
                (<tr>
                    <td colSpan={5}>No record found.</td>
                </tr>)
            }
        </tbody>
    </table>
}