import React, { useState, useEffect } from "react";
import { StoreContext } from "./context.js";
import Highlight from "./components/Highlight";
import PattenSelector from "./components/PattenSelector";
import axios from "axios";
// import * as child from 'child_process';
function App() {
  const [highlight, setHighlight] = useState("");
  const [text, setText] = useState([]);
  const [json, setJson] = useState([]);
  const [data, setData] = useState([]);
  const [python, setPython] = useState("");

  const format = (test) => {
    console.log(test);
    let lines = test.map((item) => item.lineNum);

    let uniqueLines = [...new Set(lines)];

    let newTest = [];
    uniqueLines.forEach((item) => {
      newTest.push({
        lineNum: item,
        selections: [],
      });
    });

    test.forEach((item) => {
      newTest.forEach((ele) => {
        if (item.lineNum === ele.lineNum) {
          ele.selections.push(item.selections);
        }
      });
    });

    newTest.forEach((items) => {
      let newItem = items.selections.flat(2);
      items.selections = newItem;
    });
    setJson(JSON.stringify(newTest));
    exportData(newTest);
  };

  function name(params) {
    return deleteFile()
  }
  // const createJson = () =>{}
  const exportData = async (newData) => {
    return await axios.delete('http://localhost:3005/api/delete').then((res) => {
      if (res.status === 200) {
        console.log("Delete successfully")
        const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(
          JSON.stringify(newData)
        )}`;
        const link = document.createElement("a");
        link.href = jsonString;
        link.download = "sample.json";

        link.click();      
      }
    }).then(async () => {
      console.log("IT'S WORKS");
      const parsered = await axios.get('http://localhost:3005/api/parser');
      console.log("parsered", parsered)
    })
    // const promise = new Promise((resolve,reject)=>{
    //  axios.get('http://localhost:3005/api/delete').then((res)=>{
    //   console.log(res);
    //     resolve(res.status);
    //   });
    // })
    
    // const promise2 = new Promise((resolve,reject)=>{
    //   axios.get('http://localhost:3005/api/parser').then((res)=>{
    //     console.log("PROMISE 2")
    //     resolve({status: res.status})
    //   });
    //  })
    //  const promise3 = new Promise((resolve,reject)=>{
    //   axios.get('http://localhost:3005/api/python').then((res)=>{
    //     resolve({status :res.status, result:res.data})
    //   });
    //  })

    // promise.then((data)=>{
    // if(data === 200){
    //   console.log("xoa dc roi");
    //   const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(
    //     JSON.stringify(newData)
    //   )}`;
    //   const link = document.createElement("a");
    //   link.href = jsonString;
    //   link.download = "sample.json";
  
    //    link.click();
    //    return promise2;
    // }
 
    // }).then((data)=>{
    //   if(data === 200){
    //     console.log("java ");

    //      return promise3;
    //   }
    // })
    // .then((data)=>{
    //   if(data.status === 200){
    //     console.log("python ");

    //       setPython(data.result)
    //   }
    // })
    // deleteFile()

    // console.log("2");

    
 
      
    //  setTimeout(() => {
    //  getJava();
      
    //  }, 1000);
     
    //  setPython("")
    //  setTimeout(() => {
    //  getPython();
      
    //  }, 3000);
      
    
   
    //  setPython(readPython());
      // import {text } from './parser.py';
      // setTimeout(() => {

      // }, 2000);
      // setPython(readPython());
 
  };

//   const fetchPythonCode = async() =>{
//  fetch("http://localhost:3005/api/python").then((res)=>{
//     console.log(res.text());
//  });
//     // console.log(data);
//     // setPython(data);
//   // return data.text();
//   }
  async function getPython() {
    try {
      // const response1 = await axios.get('http://localhost:3005/api/parser');
      const response = await axios.get('http://localhost:3005/api/python');
      console.log(response);
      // console.log(response1);

      setPython(response.data)
    } catch (error) {
      console.error(error);
    }
  }
  async function deleteFile() {
    try {
      // const response1 = await axios.get('http://localhost:3005/api/parser');
      const response = await axios.get('http://localhost:3005/api/delete');
      console.log(response);
      // console.log(response1);

      // setPython(response.data)
      // console.log(response);
      // callback(response);
    } catch (error) {
      console.error(error);
    }
  }
  async function getJava() {
    try {
      const response = await axios.get('http://localhost:3005/api/parser');
      console.log(response);
      // setPython(response.data)
    } catch (error) {
      console.error(error);
    }
  }

  
  const handleChange = (e) => {
    console.log(e.target.value)
    const { value } = e.target;
    let splitArray = value.split("\n");
    setText(splitArray);
  };

 const showFile = async (e) => {
    e.preventDefault()
    const reader = new FileReader()
    reader.onload = async (e) => { 
      const text = (e.target.result)
      console.log(text)
      setPython(text)
      // alert(text)
      // child.exec("javac /Users/hoangminh/Downloads/parser/App.java")

    };
    reader.readAsText(e.target.files[0])
  }
  return (
    <StoreContext.Provider value={{ data, setData, json, setJson }}>
      <div
        className="wrapper"
        style={{ display: "flex", alignItems: "center" }}
      >
        <div className="content-left" style={{ width: "50%" }}>
          <h3>Text input</h3>
          <textarea
            rows="10"
            onChange={(e) => handleChange(e)}
            style={{ width: "100%", height: "300px" }}
          ></textarea>
          <PattenSelector text={text} />
        </div>

        {/* <input
        type="text"
        onChange={(e) => {
          handleChange(e);
        }}
      /> */}
        <div className="export" style={{ padding: "0 20px" }}>
          <button onClick={() => format(data)}>Export</button>
          {/* <input type="file" onChange={(e) => showFile(e)} /> */}
        </div>
        <div classname="content-right" style={{ width: "50%" }}>
          <Highlight json={json} python={python} />
        </div>
      </div>
    </StoreContext.Provider>
  );
}

export default App;
