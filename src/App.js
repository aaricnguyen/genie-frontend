import React, { useState, useEffect } from "react";
import axios from "axios";
import { uniqBy } from 'lodash';
import { StoreContext } from "./context.js";
import Highlight from "./components/Highlight";
import FormInput from "./components/FormInput";

import styles from "./App.module.css";

function App() {
  const [text, setText] = useState([]);
  const [json, setJson] = useState([]);
  const [group, setGroup] = useState([]);
  const [data, setData] = useState([]);
  const [python, setPython] = useState("");
  const [cliText, setCliText] = useState({});
  const [cliJson, setCliJson] = useState({});
  const [testParser, setTestParser] = useState("");
  const [isDisabled, setIsDisabled] = useState(true);
  const [cliCommand, setCliCommand] = useState("");
  const myRef = React.createRef();

  const format = (e, test) => {
    e.preventDefault();
    console.log(text);
    console.log("data: ", data);
    let lines = test.map((item) => item.lineNum);
    let blocks = test.filter((item) => item.isBlock === true);

    let startLines = blocks.map((item) => item.lineStart);
    let endLines = blocks.map((item) => item.lineEnd);

    let uniqueLines = [...new Set(lines)];

    let uniqueSelections = [...new Set(test)];

    console.log("uniqueSelections: ", uniqueSelections)

    console.log("data test: ", test)

    let newTest = [];
    if (blocks.length > 0) {
      startLines.forEach((item, index) => {
        newTest.push({
          lineStart: item,
          lineEnd: endLines[index],
          isBlock: true,
          dictionary: [],
        });
      });
    }

    uniqueLines.forEach((item) => {
      if (item !== undefined) {
        newTest.push({
          lineNum: item,
          selections: [],
        });
      }
    });
  
    newTest.forEach((ele) => {
      // let newSelections = []
      let addedNames = []
      test.forEach((item) => {
        if (item.lineNum === ele.lineNum && item.isBlock === undefined) {
          
          if (ele.selections.length === 0) {
            ele.selections.push(item.selections);
            // newSelections.push(item.selections);
            addedNames.push(item.selections[0].name)
          }
          else {
            let flag = false;
            ele.selections?.forEach((sel) => {
              if (item.selections[0].start === sel[0].start || addedNames.includes(item.selections[0].name)) {
                flag = true;
              }
              
          })
          if (flag === false) {
            ele.selections.push(item.selections);
            // newSelections.push(item.selections);
            addedNames.push(item.selections[0].name)
          }
          }
          // ele.selections.push(item.selections);
        }
      });
    });

    test.forEach((item, index) => {
      newTest.forEach((ele) => {
        if (
          ele.lineStart <= item.lineNum &&
          ele.lineEnd >= item.lineNum &&
          ele.isBlock === true
        ) {
          if (checkString(item.selections[0].value)) {
            ele.dictionary.push(item);
            delete newTest[index];
          }
        }
      });
    });

    let temp = newTest.filter((el) => {
      return el !== null;
    });
    newTest = temp;

    // test.forEach((item) => {
    //   newTest.forEach((ele) => {
    //     if (ele.isBlock !== undefined) {
    //       if (item.lineStart <= ele.lineNum && item.lineEnd >= ele.lineNum) {
    //         console.log("dictionary: ", ele.dictionary);
    //         let newItem = ele.dictionary.flat(2);
    //         console.log("newItem: ", newItem);
    //       }
    //     }
    //   })
    // })

    // newTest.forEach((items) => {
    //   if (items.isBlock !== undefined) {
    //     let newItem = items.dictionary.flat(2);
    //     items.dictionary = newItem;
    //   } else {
    //     let newItem = items.selections.flat(2);
    //     items.selections = newItem;
    //   }
    // });

    newTest.forEach((items) => {
      if (items.isBlock === undefined) {
        let newItem = items.selections.flat(2);
        items.selections = newItem;
      }
    });

    setJson(JSON.stringify(newTest, undefined, 1));
    const element = document.createElement("a");
    const cli_output_json = new Blob([JSON.stringify(newTest)], {
      type: "application/json",
    });
    // var displayJsonData = JSON.stringify(newTest, undefined);
    // document.getElementById('jsonOutput').innerHTML = displayJsonData;
    // var data = new FormData();
    //  data.append("file", cli_output_text);
    var cliJson = new File([cli_output_json], "cli_output_json", {
      lastModified: new Date(),
      type: "application/json",
    });
    setCliJson(cliJson);
    // element.href = URL.createObjectURL(file);
    // console.log(element.href);
    // element.download = "myFile.json";
    // element.click();
    let formData = new FormData();
    formData.append("json_output_file", cliJson, "showversion.json");
    formData.append("cli_output_file", cliText, "showversion.txt");
    generatePy(formData);

    // exportData(newTest);
  };
  const testPy = (e) => {
    e.preventDefault();
    setTestParser("");
    let parserPy = new Blob([JSON.stringify(python)], {
      type: "text/plain",
    });
    let parserPyFile = new File([parserPy], "parser_file", {
      lastModified: new Date(),
      type: "text/plain",
    });

    console.log("parserPyFile", parserPyFile);
    console.log("cliJson", cliJson);
    console.log("cliText", cliText);

    let formData = new FormData();
    formData.append("parser_output_file", parserPyFile, "parser_N.py");
    formData.append("json_output_file", cliJson, "showversion.json");
    formData.append("cli_output_file", cliText, "showversion.txt");

    axios({
        url: `http://10.78.96.78:5001/api/test?cli_command=${cliCommand}`,
        method: "POST",
        // headers: {
        //   "Access-Control-Allow-Origin": "No",
        //   "Content-Type": "multipart/form-data",
        // },
        data: formData,
      }).then((res)=>{
        console.log(res.data);
        setTestParser(JSON.stringify(res.data, undefined, 1))
      })
  };

  // const createFilePy = (file) => {
  //   let parserPy = new Blob([JSON.stringify(file)], {
  //     type: "text/plain",
  //   });
  //   let parserPyFile = new File([parserPy], "parser_file", {
  //     lastModified: new Date(),
  //     type: "text/plain",
  //   });

  //   let formData = new FormData();
  //   formData.append("parser_output_file", parserPyFile, "parser_N.py");
  //   return formData;
  // };

  // useEffect(() => {
  //   if (python) {
  //     const formData = createFilePy(python);
  //   }
  // }, [python]);
  const generatePy = async (formData) => {
    try {
      setTestParser("");
      setPython("");
      const { data, status } = await axios({
        url: `http://10.78.96.78:5001/api/parser?cli_command=${cliCommand}`,
        method: "POST",
        // headers: {
        //   "Access-Control-Allow-Origin": "No",
        //   "Content-Type": "multipart/form-data",
        // },
        data: formData,
      });
      if (status === 200) {
        setPython(data);
      }
    } catch (e) {
      console.log(e);
    }
  };
  function name(params) {
    return deleteFile();
  }

  const checkString = (str) => {
    return group.some((val) => val.includes(str));
  };

  async function deleteFile() {
    try {
      const response = await axios.get("http://localhost:3005/api/delete");
      console.log(response);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    if (cliCommand) {
      setIsDisabled(false);
    } else {
      setIsDisabled(true);
    }
  }, [cliCommand])

  const handleChangeCLI = (e) => {
    const { value } = e.target;
    setCliCommand(value);
  };

  return (
    <StoreContext.Provider
      value={{
        data,
        setData,
        json,
        setJson,
        group,
        setGroup,
        cliText,
        setCliText,
        cliJson,
        setCliJson,
        testParser,
        setTestParser,
      }}
    >
      <div className="wrapper">
        <section className={styles.controlsSection}>
          <form className={styles.CLICommandForm}>
            <div className={styles.formGroup}>
              <input
                type="text"
                placeholder="CLI command"
                name="cliCommand"
                className={styles.formControl}
                onChange={handleChangeCLI}
              />
            </div>
            <button className="btn-export" onClick={(e) => format(e, data)} disabled={isDisabled}>
              Generate
            </button>
            <button className="btn-export" onClick={(e)=>testPy(e)} disabled={isDisabled}>
              Test
            </button>
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
              <textarea
                className="export-json"
                style={{ height: "300px", resize: "none", outline: "none" }}
                value={json}
                >
              </textarea>
            </div>
          </div>
          <div className={styles.regexRight}>
            <Highlight python={python} testParser={testParser} />
          </div>
        </section>
      </div>
    </StoreContext.Provider>
  );
}

export default App;
