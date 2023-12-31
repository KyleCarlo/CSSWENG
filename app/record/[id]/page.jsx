'use client';
import React, { useState } from 'react';
import useSWR from 'swr';
import Navbar from "@/components/navigation";
import CustomView from '@/components/view-edit-questions/customview';
import styles from '@/components/create-record/styles.module.css';
import History from '@/components/view-edit-questions/history';
import { useCookies } from 'react-cookie';
import Loading from '@/components/loading';
import Error from '@/app/not-found';

/**
 * Fetcher function for fetching data from the API.
 * 
 * @function
 * @param {String} url - The url to fetch the data from.
 * @return {Object} - The response from the API.
 */
const fetcher = (url) => fetch(url).then((res) => res.json());

/**
 * Creates a log entry for the edit history.
 * 
 * @function
 * @param {string} id - The id of the record.
 * @param {string} currentUser - The username of the current user.
 * @return {Object} - The response from the API.
 */
const createLog = async (id, currentUser) => {
    try {
        const response = await fetch(process.env.NEXT_PUBLIC_VERCEL_URL+`/api/record-logs?id=${id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({editedBy: currentUser, action: 'edited', timestamp: Date.now()}),
        }).then((res) => res.json());

        if (response.ok) {
        // Handle the successful response here
            console.log('PATCH request was successful');
        } else {
        // Handle errors or non-2xx responses
            console.log(response);
            // console.error('PATCH request failed: ', errorMsg.current);
        }
    } catch (error) {
        console.error('An error occurred:', error);
    };
}

/**
 * Record page. Displays the record page.
 * 
 * @page
 * @param {Object} params - The parameters passed to the component. 
 * @return {JSX.Element} The Record component.
 */
const Record = ({params}) => {
    const [isLogVisible, setLogVisible] = useState(false);

    const [didEdit, setDidEdit] = useState(false);

    const [isLogCreated, setLogCreated] = useState(false);

    const [cookies, setCookie] = useCookies(['user']);

    if (didEdit && !isLogCreated) {
        createLog(params.id, cookies.user.username);
        setLogCreated(true);
    }

    const {data, isLoading, error} = useSWR(`/api/records?id=${params.id}`, fetcher);
    
    if (isLoading) return (<Loading/>);
  
    if (error) return (<Error/>);
    
    if (!data.record || !data.log) return (<Error/>);
    
    const filteredKeys = Object.keys(data.record).filter((item) => item !== "_id" && item !== 'isdeleted' && item !== 'expirationDate' && item !== '__v');
    const filteredEntries = filteredKeys.map(key => [key, data.record[key]]);
    //sort by the field order
    const dataArr = filteredEntries.sort(([, a], [, b]) => a.order - b.order);

    const showLogs = () => {
        setLogVisible(!isLogVisible);
    }
    
    const logs = data.log.edits.sort((a,b) => b.timestamp-a.timestamp);

    return (
        <div>
            <Navbar recordId={params.id} showLog={showLogs} isLogVisible={isLogVisible}/>
            <div className={`${styles.body} container-fluid my-3 px-2 pt-1 px-md-5 pt-md-3`}>
                <div className="flex-row justify-content-center align-items-center">

                    {/* map items in dataArr to CustomView */}
                    {dataArr.map((item, i) => {
                        if(item[1].type) {
                            return <CustomView key={i} id={data.record._id} question={item[0]} answer={item[1].value} options={item[1].options} required={item[1].required} type={item[1].type} order={item[1].order} didEdit={setDidEdit}/>
                        }
                    })}
                    {isLogVisible && (<History logs={logs} showLogs={showLogs}/>)}
                </div>
            </div>
        </div>
    );
};
export default Record;