import React, { useState, useEffect } from 'react';
import './test.css';
import json from './test_data.json';
import Pagination from './pagination';

// const removeIndex = data.map((item) => { return item.id; }).indexOf(id);

const rowCount = 10
let allDeletedItem = []

const Test = () => {
    const [page, setPage] = useState(1)
    const [data, setData] = useState([])
    const[firstData,setFirstData] = useState([])
 
    const [editable, setEditable] = useState({
        status: false,
        item: null
    })

    const [checkedItems, setCheckedItems] = useState([])

    

    // useEffect(() => {
    //     // setData(json.filter(item => item.pageId === page))
    //     console.log('DATATATAT: ',json.slice(page*rowCount-rowCount,page*rowCount))
    //     setData(json.slice(page*rowCount-rowCount,page*rowCount))
    //     checkedItems?.length > 0 && setCheckedItems([])
    // }, [page])

    useEffect(()=>{
        setFirstData(json)
    },[])

    useEffect(()=>{
        setData(firstData.slice(page*rowCount-rowCount,page*rowCount))
    },[page,firstData])

    const onHandleEdit = (item) => {
        console.log('Item: ', item)
        setEditable({ status: true, item: item })
    }

    const onSubmite = (event) => {
        event.preventDefault();
        console.log(event.target.value)
    }

    const onHandleDelete = async() => {
        console.log('Delete')
        let dataCopy = firstData
        for (let i = 0; i < checkedItems.length; i++) {

            //datanin icinde check olunmus idlere gore indexsi tapib esas datadan silirik ve hemcinin silinenleri delete arrayina elave edirik
            allDeletedItem = [...allDeletedItem, ...dataCopy.splice(firstData.map(item => { return item.id.toString() }).indexOf(checkedItems[i]), 1)];
        }

        setCheckedItems([])
        setFirstData([...dataCopy])
        
    }


    //check
    const onCheckedRow = (event, id) => {

        let checked = event.target.checked;

        //hamsini sec
        if (event.target.name === 'all') {
            //hamsini secmeyi legv et
            if (!checked) {
                setCheckedItems([])
            }
            //hamsini sec.secilen varsa digerlerinide sec
            else {
                const notInclude = data.filter(item => !checkedItems.includes(item.id.toString())).map(i => { return i.id.toString() })
                setCheckedItems([
                    ...checkedItems,
                    ...notInclude

                ])
            }

        }
        else {
            //secileni secilen listinden silmek
            if (checkedItems.includes(id.toString())) {
                if (checked === false) {
                    const checkItemsCopy = [...checkedItems]
                    checkItemsCopy.splice(checkedItems.indexOf(id.toString()), 1);
                    setCheckedItems(checkItemsCopy);
                }
            }
            // secileni secilenler listine elave etmek
            else {
                setCheckedItems([...checkedItems, event.target.name]);
            }

        }
    }

    console.log('Checked: ', checkedItems)

    return (
        <div>
            <form onSubmit={(e) => onSubmite(e)}>
                <table>
                    <thead>
                        <tr>
                            <th><input type="checkbox" checked={checkedItems.length >= data.length} id="all" name="all" onChange={(e) => onCheckedRow(e)} /></th>
                            <th>Id</th>
                            <th>Title</th>
                            <th>Completed</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data?.map((item, index) => {
                            const { id, title, completed } = item

                            return (
                                <tr key={id}>
                                    {editable.status && id === editable.item.id ?
                                        <>
                                            <td><input type="checkbox" id={id} name={id} onChange={(e) => onCheckedRow(e)} /></td>
                                            <td><input value={item.id} /></td>
                                            <td><input value={item.title} /></td>
                                            <td><input value={item.completed.toString()} /></td>
                                            <td><button type="submit" >submit</button></td>
                                        </>
                                        :
                                        <>
                                            <td><input type="checkbox" checked={checkedItems.includes(id.toString())} id={id} name={id} onChange={(e) => onCheckedRow(e, id)} /></td>
                                            <td>{id}</td>
                                            <td>{title}</td>
                                            <td>{completed.toString()}</td>
                                        </>
                                    }
                                    <td>
                                        <button onClick={() => onHandleEdit(item)}
                                        >Edit</button>
                                    </td>

                                </tr>
                            )
                        })}

                    </tbody>
                </table>
            </form>
            <button onClick={onHandleDelete}>
                Delete
            </button>
            <button onClick={() => console.log(allDeletedItem)}>
                Submite
            </button>
            <div>
                <Pagination currentPage={page} setCurrentPage={setPage} maxPages={Math.ceil(firstData.length / 10)} />
            </div>
        </div>
    )
}

export default Test;