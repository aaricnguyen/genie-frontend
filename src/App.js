import React, { useState, useEffect, useContext } from "react";
import Highlight from "./components/Highlight";
import PattenSelector from "./components/PattenSelector";
import axios from "axios";
import { StoreContext } from "./context.js";
import FormInput from './components/FormInput'

function App() {
  const [highlight, setHighlight] = useState("");
  const [text, setText] = useState([]);
  const [json, setJson] = useState([]);
  const [data, setData] = useState([]);
  const [python, setPython] = useState("");
  const myRef = React.createRef()

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

  // const getSeclection = () => {
  //   var lines =
  //     text.findIndex(
  //       (val) => val.includes(window.getSelection().focusNode.nodeValue)
  //     ) + 1;
  //     console.log(window.getSelection().focusNode.nodeValue);
      
  //   if(window.getSelection().toString() !== "") {
  //     setCount(count +1);
  //     let start = window.getSelection().anchorOffset;
  //     let end = window.getSelection().focusOffset - 1;

  //     if(start > end) {
  //       start = window.getSelection().focusOffset;
  //       end = window.getSelection().anchorOffset-1;
  //     }
  //     setDataTest((prev) => {
  //       return [
  //         ...prev,
  //         {
  //           lineNum: lines,
  //           selections: [
  //             {
  //               name:String.fromCharCode(65+count),
  //               value: window.getSelection().toString(),
  //               start: start,
  //               end: end,
  //               type: "",
  //               regex: "",
  //               description: "",
  //             },
  //           ],
  //         },
  //       ];
  //     });
  //     hightlightText(); 
  //   }
  // };

  // const hightlightText = () => {
  //   var selection = window.getSelection();
  //   var range = selection.getRangeAt(0);
  //   var newNode = document.createElement("span");
  //   newNode.setAttribute("style", "background-color: pink;");
  //   range.surroundContents(newNode); 
  // };

  return (
    <StoreContext.Provider value={{ data, setData, json, setJson }}>
      <div
        className="wrapper"
        style={{ display: "flex", alignItems: "center" }}
      >
        <div className="content-left" style={{ width: "50%" }}>
          <h3>Text input</h3>
          {/* <textarea
            rows="10"
            onChange={(e) => handleChange(e)}
            ref={myRef}
            style={{ width: "100%", height: "300px" }}
            value={text}
          /> */}
          <FormInput />
          {/* <PattenSelector text={text} /> */}
        </div>
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
