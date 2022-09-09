import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { StoreContext } from "./context.js";
import Highlight from "./components/Highlight";
import PattenSelector from "./components/PattenSelector";
import FormInput from './components/FormInput';

import styles from './App.module.css';

function App() {
  const [highlight, setHighlight] = useState("");
  const [text, setText] = useState([]);
  const [json, setJson] = useState([]);
  const [isBlock, setIsBlock] = useState(false);
  const [data, setData] = useState([]);
  const [python, setPython] = useState("");
  const myRef = React.createRef()

  const format = (e, test) => {
    e.preventDefault();
    console.log(test);
    let lines = test.map((item) => item.lineNum);
    let blocks = test.filter((item) => item.isBlock === true);

    console.log("BLOCKS: ", blocks);

    let startLines = blocks.map((item) => item.lineStart);
    let endLines = blocks.map((item) => item.lineEnd);

    let uniqueLines = [...new Set(lines)];

    let newTest = [];
    if (blocks.length > 0) {
      startLines.forEach((item, index) => {
        newTest.push({
          lineStart: item,
          lineEnd: endLines[index],
          isBlock: true,
          dictionary: []
        })
      })
    } 
    
    uniqueLines.forEach((item) => {
      if (item !== undefined) {
        newTest.push({
          lineNum: item,
          selections: [],
        });
      }
    });

    console.log("newTest: ", newTest)

    test.forEach((item) => {
      newTest.forEach((ele) => {
        if (item.lineNum === ele.lineNum && item.isBlock === undefined) {
          ele.selections.push(item.selections);
        }
      });
    });

    test.forEach((item) => {
      newTest.forEach((ele) => {
        if (ele.isBlock !== undefined) {
          
        }
      })
    })

    // newTest.forEach((items) => {
    //   if (items.isBlock !== undefined) {
    //     let newItem = items.dictionary.flat(2);
    //     items.dictionary = newItem;
    //   } else {
    //     let newItem = items.selections.flat(2);
    //     items.selections = newItem;
    //   }
    // });

    // newTest.forEach((items) => {
    //   let newItem = items.selections.flat(2);
    //   items.selections = newItem;
    // })

    setJson(JSON.stringify(newTest));
    exportData(newTest);
  };

  function name(params) {
    return deleteFile()
  }

  const exportData = async (newData) => {
    await axios.delete('http://localhost:3005/api/delete').then((res) => {
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
      axios.get('http://localhost:3005/api/check').then( async(res)=>{
        if(res.data){
          console.log("IT'S WORKS");
          setPython('')
          const parser = await axios.get("http://localhost:3005/api/parser");
          const python = await axios.get("http://localhost:3005/api/python");
          setPython(python.data)
          console.log(parser);
        }
      });
    })
  };

  async function getPython() {
    try {
      const response = await axios.get('http://localhost:3005/api/python');
      console.log(response);
      setPython(response.data)
    } catch (error) {
      console.error(error);
    }
  }

  async function deleteFile() {
    try {
      const response = await axios.get('http://localhost:3005/api/delete');
      console.log(response);
    } catch (error) {
      console.error(error);
    }
  }
  async function getJava() {
    try {
      const response = await axios.get('http://localhost:3005/api/parser');
      console.log(response);
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

    };
    reader.readAsText(e.target.files[0])
  }

  return (
    <StoreContext.Provider value={{ data, setData, json, setJson }}>
      <div className="wrapper">
        <section className={styles.controlsSection}>
          <form className={styles.CLICommandForm}>
            <div className={styles.formGroup}>
              <input type="text" placeholder="CLI command" className={styles.formControl} />
            </div>
            <button className="btn-export" onClick={(e) => format(e, data)}>Generate</button>
            <button className="btn-export">Test</button>
          </form>
        </section>
        <section className={styles.regexSection}>
          <div className={styles.regexLeft}>
            <div className={styles.cliOutput}>
              <h2 className={styles.regexLeftTitle}>CLI Output</h2>
              <FormInput />
            </div>
            <div className="json" style={{ width: "100%", height: "100%" }}>
              <h2 className="json-title">JSON</h2>
              <textarea className="export-json" value={json} style={{height:'300px', resize: 'none', outline: 'none'}}></textarea>
            </div>
          </div>
          <div className={styles.regexRight}>
            <Highlight json={json} python={python} />
          </div>
        </section>
        
      </div>
    </StoreContext.Provider>
  );
}

export default App;
