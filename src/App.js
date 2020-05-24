import React, { useState, useRef, useEffect, useLayoutEffect } from 'react';
import Footer from './components/Footer';
import {LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer} from 'recharts';
import { Table } from 'react-bootstrap';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';

function App() {

  const [newsState, setNewsState] = useState({
    newsData : []
  })

  const [pageNoState, setPageNoState] = useState(0);

  const isFirstRun = useRef(true);

  const chartData = [];
  const baseUrl = 'http://hn.algolia.com/api/v1/search?tags=front_page';


  /*
    This method fetches news data from api call
  */
  const fetchNewsData = (pageNo) => {
    let url;
    if(pageNo >= 0) {
      url = baseUrl + '&page='+pageNo;
    } else {
      url = baseUrl;
    }
    return axios.get(url);
  }

  // I have used a new hook 'useLayoutEffect instead of useEffect.
  useLayoutEffect(() => {
    fetchNewsData(0)
      .then((searchData) => {
        let upvoteMap = JSON.parse(localStorage.getItem('upVoteMap'));
        let hitsData = searchData.data.hits;
        if(Array.isArray(hitsData) && hitsData.length > 0) {
          for(let i=0; i<hitsData.length; i++){
            let objId = hitsData[i].objectID;
            if(upvoteMap && upvoteMap[objId] && hitsData[i].points < upvoteMap[objId]){
              hitsData[i].points = upvoteMap[objId];
            }
          }
          setNewsState({newsData: hitsData});
        }
      })
  },[setNewsState])

  /*
    This hook is called everytime when newsState is modified.
  */
  useEffect(() => {
    if(newsState.newsData.length) {
      setUpvoteMap(newsState.newsData);
    }

  },[newsState]);

  /*
    This hook is called everytime when pageNoState is modified except for the initial load.
  */
  useEffect(() => {
    if(isFirstRun.current){
      isFirstRun.current = false;
      return;
    }
    fetchNewsData(pageNoState)
    .then((searchData) => {
      let hitsData = searchData.data.hits;
      setNewsState({newsData: hitsData});
    });
  },[pageNoState]);


  /*
    This method creates a map of Object id and upvotes and saves it to local storage
  */
  const setUpvoteMap = (dataArr) => {
    let upvoteMap = {};
    for(let i=0;i<dataArr.length; i++) {
      upvoteMap[dataArr[i].objectID] = dataArr[i].points;
    }
    //console.log('upvote map is',upvoteMap);
    localStorage.setItem('upVoteMap', JSON.stringify(upvoteMap));
  }

  /*
    This method extracts news domain from a given url
  */
  const getNewsDomain = (url) => {
    if(url) {
      let urlArr = url.split("/");
      return urlArr[2];
    } else {
      return 'unknown';
    }

  }

  /*
    This method increases upvote count by 1 and updates corresponding state variable.
  */
  const addUpvote = (objId) => {
    let origData = [...newsState.newsData];
    let objIndex = origData.findIndex((data) => {
      return data.objectID === objId;
    })
    origData[objIndex].points += 1;
    setNewsState({newsData : origData});
  }

  /*
    This method filters news data array by removing the object with given objectId
  */
  const hideNews = (objId) => {
    let origData = [...newsState.newsData];
    origData = origData.filter((data) => {
      return data.objectID !== objId;
    })
    setNewsState({newsData : origData});
  }

  /*
    This method performs new api call for next/previous pages by increasing or decreasing page no.
  */
  const onPageButtonClick = (button) => {
    let pageNo = pageNoState;
    if(button === 'next') {
      pageNo ++;
    } else if(button === 'prev') {
      pageNo --;
    }
    setPageNoState(pageNo);
  }

  let dataRows = null;
  if(Array.isArray(newsState.newsData) && newsState.newsData.length > 0) {
    dataRows = newsState.newsData.map(data => {
      return (
        <tr className="table-row" key={data.objectID}>
          <td>{data.num_comments}</td>
          <td>{data.points}</td>
          <td className="upvote-column">
            <i onClick = {() => addUpvote(data.objectID)} className="arrow-up"></i>
            <span className="tooltiptext">Upvote</span>
          </td>
          <td className="title-column">
            <span><a href={data.url} target="_blank" rel="noopener noreferrer">{data.title}</a></span>
            <span className="subtext">({getNewsDomain(data.url)})</span>
            <span className="subtext">by <span className="subtext_highlight">{data.author}</span> </span>
            <span className="subtext"><span onClick={() => hideNews(data.objectID)} className="subtext_highlight hide">[ hide ]</span></span>
          </td>
        </tr>
      )
    })
  }

  for(let i=0; i<newsState.newsData.length; i++) {
    let dataObj = {
      name: newsState.newsData[i].objectID,
      value: newsState.newsData[i].points
    }
    chartData.push(dataObj);

  }


  return (
    <>
      <div className="App">
        <h2>Welcome</h2>
        <div className="table-container">
          <Table responsive striped bordered hover>
            <thead className="table-head">
              <tr className="table-row">
                  <th>Comments</th>
                  <th>Vote count</th>
                  <th>Upvote</th>
                  <th className="col-1">New details</th>
                </tr>
            </thead>
            <tbody>
              {dataRows}
            </tbody>
          </Table>
          <div className="pagination-container">
            <span onClick={() => onPageButtonClick('prev')}>Previous</span>
            <span onClick={() => onPageButtonClick('next')}>Next</span>
          </div>
        </div>
        <div className="chart-container">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}
                    margin={{top: 10, right: 30, left: 0, bottom: 0}}>
              <CartesianGrid strokeWidth="3 0" vertical={false}/>
              <XAxis dataKey="name" interval={0} angle={-90} textAnchor="end" height={80} label={{ value: 'ID', position: 'centerBottom', dy:30, fontSize:16, fontWeight:'bold' }} />
              <YAxis type="number" tickCount={6} domain={[0, 2000]} label={{ value: 'Votes', position: 'insideLeft', dy:25, dx:10, fontSize:16, fontWeight:'bold', angle:-90 }}/>
              <Tooltip/>
              <Line isAnimationActive={false} connectNulls={true} type="linear" dataKey='value' stroke='#3562A5' fill='#8884d8' />
            </LineChart>
          </ResponsiveContainer>

        </div>
      </div>
      <Footer companyName="Publicis Sapient" />
    </>
  );
}

export default App;
